// app/dashboard/DashboardHeader.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";

export default function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    // Eliminar las variables de localStorage
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("user_preferences");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiration");

    router.push("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-neutral-800">
      {/* Botón Home a la izquierda */}
      <div>
        {pathname !== "/dashboard" && (
          <button
            onClick={goHome}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Home
          </button>
        )}
      </div>

      {/* Botones de usuario siempre a la derecha */}
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={() => router.push("/usr")}
        >
          Usuario
        </button>
        <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          onClick={() => router.push("/dashboard/components/favoritos")}
        >
          Favoritos
        </button>
        <button
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
          onClick={handleLogout}
        >
          LogOut
        </button>
      </div>
    </div>
  );
}
