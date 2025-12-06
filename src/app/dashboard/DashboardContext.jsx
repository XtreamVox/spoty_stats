"use client";

import { createContext, useContext, useState } from "react";

// 1. Crear el contexto
const DashboardContext = createContext();

// 2. Hook para usar el contexto en cualquier componente
export const useDashboard = () => useContext(DashboardContext);

// 3. Provider: envuelve todas las páginas del dashboard
export default function DashboardProvider({ children }) {
  // Estados de datos de cada widget
  const [artistData, setArtistData] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [moodData, setMoodData] = useState(null);
  const [decadeData, setDecadeData] = useState(null);
  const [popularityData, setPopularityData] = useState(null);
  const [trackData, setTrackData] = useState(null);

  // Estados de preferencias
  const [preferences, setPreferences] = useState({
    artist: null,
    genre: null,
    mood: null,
    decade: null,
    popularity: null,
    track: null,
  });

  // Función para hacer fetch solo si no hay datos
  const loadIfNeeded = async (setter, state, url) => {
    if (state) return state; // ya tenemos los datos
    const response = await fetch(url);
    const data = await response.json();
    setter(data);
    return data;
  };

  // Valor que se comparte con todos los componentes hijos
  const value = {
    artistData, setArtistData,
    genreData, setGenreData,
    moodData, setMoodData,
    decadeData, setDecadeData,
    popularityData, setPopularityData,
    trackData, setTrackData,
    preferences, setPreferences,
    loadIfNeeded
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
