import { getAccessToken } from "@/lib/auth";
import { MOOD_GENRE_MAP } from "@/app/dashboard/components/mood_widget/moods";

function getMoodGenres(userGenres, mood) {
  const preset = mood?.name;

  if (!preset || !MOOD_GENRE_MAP[preset]) {
    return userGenres;
  }

  const moodGenres = MOOD_GENRE_MAP[preset];

  if (!userGenres || userGenres.length === 0) {
    return moodGenres.map((g) => ({ id: g, name: g }));
  }

  const intersection = userGenres.filter((g) => moodGenres.includes(g.id));

  if (intersection.length > 0) {
    return intersection;
  }

  return userGenres;
}

export async function generatePlaylist(preferences) {
  const {
    artist = [],
    genre = [],
    decade = [],
    popularity = {},
    track = [],
    mood = null,
  } = preferences;

  const token = await getAccessToken("spotify_token");
  if (!token) {
    console.error("No access token found.");
    return [];
  }

  let allTracks = [];

  // 0. Tracks añadidos manualmente
  for (const t of track) {
    allTracks.push(t);
  }

  // 1. Top tracks de artistas seleccionados
  for (const a of artist) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${a.id}/top-tracks?market=US`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data?.tracks) allTracks.push(...data.tracks);
  }

  // 2. Tracks por género combinados con mood
  const moodGenres = getMoodGenres(genre, mood);

  for (const g of moodGenres) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
        g.id
      )}&type=track&limit=20`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (data?.tracks?.items) allTracks.push(...data.tracks.items);
  }

  // 🔍 Eliminar duplicados por ID
  allTracks = Array.from(new Map(allTracks.map((t) => [t.id, t])).values());

  // 3. Filtrar por década
  if (decade.length > 0) {
    allTracks = allTracks.filter((track) => {
      const year = new Date(track.album.release_date).getFullYear();
      return decade.some((d) => {
        const start = parseInt(d.id); // ejemplo: "1960" → 1960
        return year >= start && year < start + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (
    popularity &&
    popularity.min !== undefined &&
    popularity.max !== undefined
  ) {
    const { min, max } = popularity;

    allTracks = allTracks.filter(
      (t) => t.popularity >= min && t.popularity <= max
    );
  }

  // 5. Limitar a 20 canciones finales
  return allTracks.slice(0, 20);
}
