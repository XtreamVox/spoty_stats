"use client";

import { useState, useEffect } from "react";
import { GENRES } from "./genres"; // archivo con lista de géneros { id, label }
import GenreDialog from "./genre_dialogue";
import { useDashboard } from "../../DashboardContext";
import "./genre_widget.css";

export default function GenreWidget() {
  const [openGenre, setOpenGenre] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem } = useDashboard();

  const handleClick = (genre) => {
    console.log("Se ha pulsado el género:", genre);
    setOpenGenre(genre);
  };

  const handleClose = () => {
    setOpenGenre(null);
    setTracks([]);
    setLoading(false);
  };

  // Fetch on-demand de tracks por género
  useEffect(() => {
    if (!openGenre) return;

    const fetchTracks = async () => {
      setLoading(true);
      const token = getAccessToken("spotify_token");
      if (!token) {
        console.error("No hay token disponible");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=genre:${openGenre.id}&type=track&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          console.error("Error buscando tracks:", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTracks(data.tracks.items || []);
      } catch (err) {
        console.error("Error en fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [openGenre, getAccessToken]);

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[60vh] p-4">
      {GENRES.map((genre) => (
        <div
          key={genre.id}
          className="bg-neutral-800 text-white flex flex-col items-center justify-center text-xl rounded-lg cursor-pointer hover:bg-neutral-700 transition p-2"
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
            addToPreferences
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
