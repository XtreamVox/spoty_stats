import { getAccessToken } from "@/lib/auth";

export async function savePlaylistToSpotify(name, tracks) {
  const token = await getAccessToken("spotify_token");
  if (!token) {
    console.error("No hay token de Spotify disponible");
    return;
  }

  try {
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error(`Error obteniendo usuario: ${userRes.status}`);

    const userData = await userRes.json();
    const userId = userData.id;

    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: "Playlist generada desde mi app",
        public: false,
      }),
    });

    if (!playlistRes.ok) throw new Error(`Error creando playlist: ${playlistRes.status}`);

    const playlistData = await playlistRes.json();
    const playlistId = playlistData.id;

    const uris = tracks.map((t) => t.uri);
    if (uris.length > 0) {
      const addRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      });

      if (!addRes.ok) throw new Error(`Error añadiendo tracks: ${addRes.status}`);
    }

    console.log(`Playlist "${name}" guardada correctamente con ${uris.length} tracks`);
    alert(`Playlist "${name}" guardada correctamente en tu cuenta de Spotify`);

  } catch (err) {
    console.error("Error guardando playlist:", err);
    alert(`Error al guardar la playlist: ${err.message}`);
  }
}
