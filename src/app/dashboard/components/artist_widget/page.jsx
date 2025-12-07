"use client";

import { useState } from "react";
import { useDashboard } from "../../DashboardContext";

export default function ArtistWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { preferences, setPreferences, getAccessToken } = useDashboard();

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);

    const token = getAccessToken("spotify_token");
    if (!token) {
      console.error("No hay token de Spotify disponible");
      setLoading(false);
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Error al buscar artistas:", response.status, response.statusText);
      setLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data);
    setResults(data.artists.items || []);
    setLoading(false);
  };

  const handleArtistClick = (artist) => {
    console.log("holaaaaaaaaaaaaaaa")
    console.log("Se ha pulsado: " + artist.name)
  }
const togglePreferencies = (artist) => {
  // Comprobar si el artista ya está en preferences
  const alreadySelected = preferences.artist?.some((a) => a.id === artist.id);

  let newSelected;

  if (alreadySelected) {
    // Si ya está, lo eliminamos
    newSelected = preferences.artist.filter((a) => a.id !== artist.id);
  } else {
    // Si no está, lo añadimos
    newSelected = [...(preferences.artist || []), artist];
  }

  // Actualizar preferences en el contexto
  setPreferences((prev) => ({
    ...prev,
    artist: newSelected,
  }));
  console.log(preferences.artist)
};

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca artista…"
      />
      <button onClick={handleSearch}>Buscar</button>

      {loading && <p>Cargando…</p>}

      <ul>
        {results.map((artist) => (
          <li key={artist.id}>
            <button onClick={() => handleArtistClick(artist)}>
              {artist.name}
            </button>
            <button onClick={() => togglePreferencies(artist)}>
                Preferencias
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
