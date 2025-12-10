"use client";

import { useState, useEffect } from "react";
import { GENRES } from "./genres";
import GenreDialog from "./genre_dialog";
import { useDashboard } from "../../DashboardContext";

export default function GenreWidget() {
  const [openGenre, setOpenGenre] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem, preferences } = useDashboard();

  const handleClick = (genre) => setOpenGenre(genre);
  const handleClose = () => {
    setOpenGenre(null);
    setTracks([]);
    setLoading(false);
  };

  const isSelected = (genre) =>
    Array.isArray(preferences.genre) &&
    preferences.genre.some((g) => g.id === genre.id);

  useEffect(() => {
    if (!openGenre) return;

    const fetchTracks = async () => {
      setLoading(true);
      let token = await getAccessToken("spotify_token");

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=genre:${openGenre.id}&type=track&limit=12`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          console.error("Error buscando tracks:", response.status);
          setTracks([]);
          return;
        }

        const data = await response.json();
        setTracks(data.tracks.items || []);
      } catch (err) {
        console.error("Error en fetch:", err);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [openGenre, getAccessToken]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {GENRES.map((genre) => (
        <div
          key={genre.id}
          className={`relative bg-neutral-800 text-white flex flex-col items-center justify-center rounded-lg cursor-pointer transition transform hover:scale-105 hover:bg-neutral-700 p-2 ${
            isSelected(genre)
              ? "border-2 border-green-500 ring-2 ring-green-400"
              : "border-transparent"
          } min-h-[120px]`}
          onClick={() => handleClick(genre)}
        >
          <span className="font-semibold text-center">{genre.label}</span>
          <button
            className="mt-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePreferenceItem("genre", genre);
            }}
          >
            {isSelected(genre) ? "Seleccionado" : "Añadir a preferencias"}
          </button>
        </div>
      ))}

      {openGenre && (
        <GenreDialog
          open={!!openGenre}
          onClose={handleClose}
          genre={openGenre}
          tracks={loading ? [] : tracks}
        />
      )}
    </div>
  );
}
