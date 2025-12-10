"use client";

import Image from "next/image";
import { useDashboard } from "../../DashboardContext";

export default function GenreDialog({ open, onClose, genre, tracks }) {
  const { togglePreferenceItem, preferences, toggleFavorite, favorites } = useDashboard();

  if (!open) return null;

  const isTrackSelected = (track) =>
    preferences.track?.some((t) => t.id === track.id);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 text-white rounded-xl shadow-xl p-6 w-[90vw] max-w-4xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">{genre.label}</h2>

        {tracks.length === 0 ? (
          <p className="text-neutral-400 text-center mb-4">Cargando tracks...</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <li
                key={track.id}
                className={`relative rounded-lg overflow-hidden border-2 transition-transform transform hover:scale-105 ${
                  isTrackSelected(track)
                    ? "border-green-500 ring-2 ring-green-400"
                    : "border-transparent"
                }`}
              >
                {track.album?.images?.[0]?.url ? (
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-neutral-700 flex items-center justify-center text-white p-2">
                    {track.name}
                  </div>
                )}

                {/* Overlay nombre + artistas */}
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm text-center py-1 px-1">
                  {track.name} — {track.artists.map((a) => a.name).join(", ")}
                </div>

                {/* Botón preferencias */}
                <button
                  onClick={() => togglePreferenceItem("track", track)}
                  className="absolute top-2 right-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                >
                  Preferencias
                </button>
                <button
                  onClick={() => toggleFavorite(track)}
                  className="absolute top-2 left-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded transition-colors"
                >
                  {favorites.some((fav) => fav.id === track.id)
                    ? "Quitar Favorito"
                    : "Añadir Favorito"}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
