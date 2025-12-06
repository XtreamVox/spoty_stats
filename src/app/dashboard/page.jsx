"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAccessToken } from "@/lib/auth";
import './dashboard.css'

export default function Dashboard() {
  const router = useRouter();
  // Estado para guardar la respuesta de Spotify
  const [spotifyData, setSpotifyData] = useState(null);

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (isAuthenticated()) {
      router.push("/dashboard");
    }

    // Llamada a Spotify
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/search?q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=album",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAccessToken("spotify_token")}`,
            },
          }
        );

        const data = await response.json();
        setSpotifyData(data); // Guardar en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSpotifyData();
  }, [router]);

  // Si aún no cargó la data
  if (!spotifyData) {
    return <div>Cargando...</div>;
  }

  // Obtener la primera imagen
  const firstImage = spotifyData?.albums?.items?.[0]?.images?.[0]?.url || null;

  return (<> 
  <main id = "main_page">
    <button id = "artist_widget" onClick={() => router.push("/dashboard/artist_widget")}>ARTISTAS</button>
    <button id = "decade_widget" onClick={() => router.push("/dashboard/decade_widget")}>ÉPOCAS DE MÚSICA</button>
    <button id = "genre_widget" onClick={() => router.push("/dashboard/genre_widget")}>GÉNEROS</button>
    <button id = "mood_widget" onClick={() => router.push("/dashboard/mood_widget")}>ON THE MOOD</button>
    <button id = "popularity_widget" onClick={() => router.push("/dashboard/popularity_widget")}>TOP ÉXITOS</button>
    <button id = "track_widget" onClick={() => router.push("/dashboard/track_widget")}>SINGLES</button>
  </main>
  </>
  );
}
