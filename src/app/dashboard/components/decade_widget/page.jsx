"use client";

import { useEffect, useState } from "react";
import { DECADES } from "./decades";
import DecadeDialog from "./decade_dialogue";
import { useDashboard } from "../../DashboardContext";

export default function DecadeWidget() {
  const [openDecade, setOpenDecade] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem, preferences } = useDashboard();

  const handleClick = (decade) => {
    setOpenDecade(decade);
  };

  const handleClose = () => {
    setOpenDecade(null);
    setTracks([]);
    setLoading(false);
  };

  useEffect(() => {
    if (!openDecade) return;

    const fetchDecadeTracks = async () => {
      let token = await getAccessToken("spotify_token");

      const startYear = parseInt(openDecade.id.substring(0, 4));
      const endYear = startYear + 9;

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=year:${startYear}-${endYear}&type=track&limit=12`,
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

    fetchDecadeTracks();
  }, [openDecade, getAccessToken]);

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    {DECADES.map((decade) => {
      const selected = preferences.decade.some(d => d.id === decade.id);

      return (
        <div
          key={decade.id}
          className={`relative bg-neutral-800 text-white flex flex-col items-center justify-center rounded-lg cursor-pointer transition transform hover:scale-105 hover:bg-neutral-700 ${
            selected
              ? "ring-2 ring-green-400 border-green-500 border"
              : "border-transparent"
          } min-h-[150px]`}
          onClick={() => handleClick(decade)}
        >
          <span className="text-2xl font-semibold">{decade.label}</span>
          <button
            className="mt-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePreferenceItem("decade", decade);
            }}
          >
            {selected ? "Quitar de preferencias" : "Añadir a preferencias"}
          </button>
        </div>
      );
    })}

    {/* Diálogo */}
    {openDecade && (
      <DecadeDialog
        open={!!openDecade}
        onClose={handleClose}
        decade={openDecade}
        tracks={loading ? [] : tracks}
      />
    )}
  </div>
);

}
