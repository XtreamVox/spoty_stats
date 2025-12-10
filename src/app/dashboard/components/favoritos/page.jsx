"use client";

import { useDashboard } from "../../DashboardContext";

export default function Favorites() {
  const { favorites, toggleFavorite } = useDashboard();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Favoritos</h2>
        <p>No tienes favoritos todavía.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Favoritos</h2>
      <ul className="space-y-2">
        {favorites.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-2 border rounded hover:bg-green-500 hover:border-green-500 transition-colors"
          >
            <span>{item.name || item.title}</span>
            <button
              onClick={() => toggleFavorite(item)}
              className="text-white hover:text-red-700 font-semibold"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
