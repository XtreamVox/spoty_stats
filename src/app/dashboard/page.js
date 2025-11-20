"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAccessToken } from "@/lib/auth";


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

  return (
    <div>
      {firstImage ? (
        <img src={firstImage} alt="Álbum" width={300} />
      ) : (
        <p>No se encontró imagen</p>
      )}
    </div>
  );
}
