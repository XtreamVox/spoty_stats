"use client";

import { useEffect, useState } from "react";
import { DECADES } from "./decades";
import DecadeDialog from "./decade_dialogue";
import "./decade_widget.css";
import { useDashboard } from "../../DashboardContext";

export default function DecadeWidget() {
  const [openDecade, setOpenDecade] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAccessToken, togglePreferenceItem } = useDashboard();

  const handleClick = (decade) => {
    console.log("Se ha pulsado la década:", decade);
    setOpenDecade(decade); // Guardamos el objeto completo
    console.log("openDecade es ahora:", decade);
  };

  const handleClose = () => {
    setOpenDecade(null);
    setTracks([]);
    setLoading(false);
  };

  useEffect(() => {
    if (!openDecade) return;
    const fetchDecadeTracks = async () => {
      const token = getAccessToken("spotify_token");
      if (!token) {
        console.error("No hay token de Spotify disponible");
        setLoading(false);
        return;
      }

      const startYear = parseInt(openDecade.id.substring(0, 4)); // para quitar la 's'
      const endYear = startYear + 9;
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=year:${startYear}-${endYear}&type=track&limit=10`,
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

    fetchDecadeTracks();
  }, [openDecade, getAccessToken]);
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[60vh] p-4">
      {/*Crear los bloques */}
      {DECADES.map((decade) => (
        <div
          key={decade.id}
          className="bg-neutral-800 text-white flex items-center justify-center text-2xl rounded-lg cursor-pointer hover:bg-neutral-700 transition"
          onClick={() => handleClick(decade)}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">{decade.label}</span>
            <button
              className="mt-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
              onClick={(e) => {
                e.stopPropagation();
                togglePreferenceItem("decade", decade); // guardo el objeto completo, habrá que tratar la información después
              }}
            >
              addToPreferences
            </button>
          </div>
        </div>
      ))}

      {/*Creación de dialogos*/}
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
