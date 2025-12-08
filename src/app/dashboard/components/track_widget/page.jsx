"use client";

import { useState } from "react";
import { useDashboard } from "../../DashboardContext";

export default function TrackWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem } = useDashboard();

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
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Error al buscar canciones:", response.status, response.statusText);
      setLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data);

    setResults(data.tracks?.items || []);
    setLoading(false);
  };

  const handleTrackClick = (track) => {
    console.log("Track pulsado:", track.name);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca canción…"
      />

      <button onClick={handleSearch}>Buscar</button>

      {loading && <p>Cargando…</p>}

      <ul>
        {results.map((track) => (
          <li key={track.id} className="flex gap-4 items-center">
            <button onClick={() => handleTrackClick(track)}>
              {track.name} — {track.artists.map((a) => a.name).join(", ")}
            </button>

            <button onClick={() => togglePreferenceItem("track", track)}>
              Preferencias
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
