"use client";

import { useState } from "react";
import { useDashboard } from "../../DashboardContext";

export default function ArtistWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const {getAccessToken, togglePreferenceItem } = useDashboard();

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
            <button onClick={() => togglePreferenceItem("artist", artist)}>
                Preferencias
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
