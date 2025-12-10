"use client";

import { useState } from "react";
import { generatePlaylist } from "@/lib/spotify";
import { useDashboard } from "./DashboardContext";
import { savePlaylistToSpotify } from "@/lib/playlist";
import Image from "next/image";

export default function PlaylistGenerator() {
  const { preferences = {}, resetPreferences } = useDashboard();

  const [playlistName, setPlaylistName] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const renderArray = (arr, key = "label") => {
    if (!arr || arr.length === 0) return "Ninguno";
    return arr.map((item) => item[key] || item).join(", ");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generatePlaylist(preferences);
      setTracks(result || []);
    } catch (error) {
      console.error("Error generando playlist:", error);
    }
    setLoading(false);
  };

  const removeTrack = (id) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full bg-neutral-900 text-white p-6 rounded-xl shadow-lg mb-8">
      {/* Título centrado */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        Generador de Playlist 🎧
      </h2>

      {/* Preferencias en grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {[
          { label: "Artistas", value: renderArray(preferences.artist, "name") },
          { label: "Géneros", value: renderArray(preferences.genre) },
          { label: "Décadas", value: renderArray(preferences.decade) }, 
          {
            label: "Popularidad",
            value: preferences.popularity?.label || "Ninguno",
          },
          { label: "Mood", value: preferences.mood?.name || "Ninguno" },
          { label: "Tracks", value: renderArray(preferences.track, "name") },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-between h-full"
          >
            <h3 className="text-xl font-semibold mb-2">{item.label}:</h3>
            <p className="text-sm text-neutral-300">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Input nombre playlist */}
      <input
        type="text"
        placeholder="Nombre de la Playlist"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        className="w-full p-3 mb-4 bg-neutral-800 rounded text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => handleGenerate()}
          className="bg-green-600 hover:bg-green-500 transition-colors px-5 py-2 rounded font-semibold"
        >
          Generar Playlist
        </button>

        <button
          disabled={tracks.length === 0}
          onClick={() => savePlaylistToSpotify(playlistName, tracks)}
          className={`px-5 py-2 rounded font-semibold transition-colors ${
            tracks.length === 0
              ? "bg-neutral-700 opacity-50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          Guardar en Spotify
        </button>
        {/* Botón para limpiar preferencias */}
        <button
          onClick={() => {
            localStorage.removeItem("preferences");
            setPlaylistName("");
            setTracks([]); 
            resetPreferences();
          }}
          className="bg-red-600 hover:bg-red-500 transition-colors px-5 py-2 rounded font-semibold"
        >
          Borrar Preferences
        </button>
      </div>

      {/* Lista de tracks */}
      {loading ? (
        <p className="text-center">Cargando playlist...</p>
      ) : tracks.length > 0 ? (
        <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
          {tracks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
            >
              <div className="flex items-center gap-3">
                {t.album?.images?.[0]?.url && (
                  <Image
                    src={t.album.images[0].url}
                    alt={t.name}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-sm text-neutral-400">
                    {t.artists?.map((a) => a.name).join(", ") || "Desconocido"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeTrack(t.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="opacity-50 text-center">
          No hay canciones generadas todavía. Explora los widget para generar
          playlists!!
        </p>
      )}
    </div>
  );
}
