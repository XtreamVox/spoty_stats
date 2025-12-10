"use client";

import { useState } from "react";
import Image from "next/image";
import { useDashboard } from "../../DashboardContext";

export default function TrackWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem, preferences, toggleFavorite, favorites } = useDashboard();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      let token = await getAccessToken("spotify_token");

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Error al buscar tracks");

      const data = await response.json();

      // Mapear para obtener imagen
      const mappedResults = data.tracks.items.map((track) => ({
        ...track,
        image: track.album.images?.[0]?.url || null,
      }));

      setResults(mappedResults);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTrackClick = (track) => {
    console.log("Track pulsado:", track.name);
  };

  const isSelected = (track) =>
    preferences.track?.some((t) => t.id === track.id);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Input y botón */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Busca canción…"
          className="flex-1 p-3 rounded-lg bg-neutral-800 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-neutral-400 mb-2">Cargando…</p>}

      {/* Resultados */}
      {!loading && results.length === 0 && query.trim() && (
        <p className="text-center text-neutral-500 mb-2">No se encontraron canciones.</p>
      )}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((track) => (
          <li key={track.id}>
            <button
              onClick={() => togglePreferenceItem("track", track)}
              className={`relative w-full rounded-lg overflow-hidden border-2 transition-transform transform hover:scale-105 ${
                isSelected(track)
                  ? "border-green-500 ring-2 ring-green-400"
                  : "border-transparent"
              }`}
            >
            
              {track.image ? (
                <Image
                  src={track.image}
                  alt={track.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-neutral-700 flex items-center justify-center text-white">
                  {track.name}
                </div>
              )}

              {/* Nombre y artistas en overlay inferior */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm text-center py-1 px-1">
                {track.name} — {track.artists.map((a) => a.name).join(", ")}
              </div>
            </button>
            <button
              onClick={() => toggleFavorite(track)}
              className="mt-2 w-full px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded transition-colors"
            >
              {favorites.some((fav) => fav.id === track.id)
                ? "Quitar Favorito"
                : "Añadir Favorito"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
