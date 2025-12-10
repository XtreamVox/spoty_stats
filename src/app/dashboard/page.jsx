"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

 return (<>
      <main id="main_page">
        <button
          id="artist_widget"
          onClick={() => router.push("/dashboard/components/artist_widget")}
        >
          ARTISTAS
        </button>

        <button
          id="decade_widget"
          onClick={() => router.push("/dashboard/components/decade_widget")}
        >
          ÉPOCAS DE MÚSICA
        </button>

        <button
          id="genre_widget"
          onClick={() => router.push("/dashboard/components/genre_widget")}
        >
          GÉNEROS
        </button>

        <button
          id="mood_widget"
          onClick={() => router.push("/dashboard/components/mood_widget")}
        >
          ON THE MOOD
        </button>

        <button
          id="popularity_widget"
          onClick={() => router.push("/dashboard/components/popularity_widget")}
        >
          TOP ÉXITOS
        </button>

        <button
          id="track_widget"
          onClick={() => router.push("/dashboard/components/track_widget")}
        >
          SINGLES
        </button>
      </main>
    </>
  );
}
