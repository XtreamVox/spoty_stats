"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getSpotifyAuthUrl } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (await isAuthenticated()) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [router]);
  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white px-4">
      <div className="text-center max-w-md p-8 rounded-xl shadow-lg bg-neutral-800">
        <h1 className="text-4xl font-bold mb-6">🎵 Spotify Taste Mixer</h1>
        <p className="mb-6 text-neutral-300">
          Mezcla tus gustos musicales y genera playlists personalizadas
          directamente desde Spotify.
        </p>
        <button
          onClick={handleLogin}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          Iniciar sesión con Spotify
        </button>
      </div>
    </div>
  );
}
