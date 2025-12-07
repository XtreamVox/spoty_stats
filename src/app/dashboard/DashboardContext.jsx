"use client";

import { createContext, useContext, useState } from "react";
import { getAccessToken } from "@/lib/auth";

// 1. Crear el contexto
const DashboardContext = createContext();

// 2. Hook para usar el contexto en cualquier componente
export const useDashboard = () => useContext(DashboardContext);

// 3. Provider: envuelve todas las páginas del dashboard
export default function DashboardProvider({ children }) {
  // Estado de preferencias compartidas
  const [preferences, setPreferences] = useState({
    artist: null,
    genre: null,
    mood: null,
    decade: null,
    popularity: null,
    track: null,
  });
  const togglePreferenceItem = (key, item) => {
  setPreferences((prev) => {
    const list = prev[key] || [];

    const exists = list.some((el) => el.id === item.id);

    const newList = exists
      ? list.filter((el) => el.id !== item.id)
      : [...list, item];

    return {
      ...prev,
      [key]: newList,
    };
  });
};


  // Valor que se comparte con todos los componentes hijos
  const value = {
    getAccessToken, // función para obtener token de Spotify
    togglePreferenceItem
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
