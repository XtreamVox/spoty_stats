"use client";

import { useDashboard } from "../../DashboardContext";
import { useEffect, useState } from "react";

export default function PopularityDialog({ open, onClose, range }) {
  const { getAccessToken } = useDashboard();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return; // No cargar nada si el diálogo está cerrado
    if (!range) return; // Asegurar que hay rango
    if (!getAccessToken) return;

    const fetchTracks = async () => {
      setLoading(true);

      const token = getAccessToken("spotify_token");
      if (!token) {
        console.error("No hay token de Spotify disponible");
        setLoading(false);
        return;
      }

      // Necesita un parámetro "q" obligatorio
      const url = `https://api.spotify.com/v1/search?q=a&type=track&limit=50`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(
            "Error de Spotify:",
            response.status,
            response.statusText
          );
          setLoading(false);
          return;
        }

        const data = await response.json();
        const allTracks = data.tracks?.items || [];

        // 🔥 Filtrar por popularidad
        const filteredTracks = allTracks.filter(
          (t) => t.popularity >= range.min && t.popularity <= range.max
        );

        setTracks(filteredTracks);
      } catch (err) {
        console.error("Error en fetch:", err);
      }

      setLoading(false);
    };

    fetchTracks();
  }, [open, range, getAccessToken]);

  if (!open) return null;

  return (
    <dialog
      open
      className="bg-neutral-900 text-white p-6 rounded-xl w-3/4 max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-4">Canciones — {range.label}</h2>

      {loading && <p>Cargando canciones...</p>}

      {!loading && tracks.length === 0 && (
        <p>No se encontraron canciones para este rango.</p>
      )}

      <ul className="max-h-[50vh] overflow-y-auto space-y-2">
        {tracks.map((track) => (
          <li key={track.id} className="p-2 bg-neutral-800 rounded-lg">
            <p className="font-semibold">{track.name}</p>
            <p className="text-sm text-neutral-400">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </li>
        ))}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
        onClick={onClose}
      >
        Cerrar
      </button>
    </dialog>
  );
}
