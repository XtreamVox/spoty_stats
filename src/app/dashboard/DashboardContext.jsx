"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/auth";

const DashboardContext = createContext();
export const useDashboard = () => useContext(DashboardContext);

export default function DashboardProvider({ children }) {
  // Valores iniciales de preferences
  const initialPreferences = {
    artist: [],
    genre: [],
    track: [],
    decade: [],
    popularity: null,
    mood: null,
  };

  const [preferences, setPreferences] = useState(initialPreferences);

  // Variable para favoritos
  const [favorites, setFavorites] = useState([]);

  // Cargar preferences y favoritos desde localStorage al montar
  useEffect(() => {
    const storedPreferences = localStorage.getItem("preferences");
    if (storedPreferences) setPreferences(JSON.parse(storedPreferences));

    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  // Sincronizar favorites con localStorage siempre que cambie
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(el => el.id === item.id);
      return exists ? prev.filter(el => el.id !== item.id) : [...prev, item];
    });
  };

  const togglePreferenceItem = (key, item, list = true) => {
    setPreferences(prev => {
      let updated;
      if (!list) {
        updated = { ...prev, [key]: prev[key]?.id === item.id ? null : item };
      } else {
        const listData = prev[key] || [];
        const exists = listData.some(el => el.id === item.id);
        const newList = exists ? listData.filter(el => el.id !== item.id) : [...listData, item];
        updated = { ...prev, [key]: newList };
      }

      localStorage.setItem("preferences", JSON.stringify(updated));
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(initialPreferences);
    localStorage.setItem("preferences", JSON.stringify(initialPreferences));
  };

  const value = {
    getAccessToken,
    togglePreferenceItem,
    refreshAccessToken,
    preferences,
    resetPreferences,
    favorites,
    toggleFavorite,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
