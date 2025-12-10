// app/dashboard/UserWidget.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth";
import DashboardHeader from "../dashboard/DashboardHeader";

export default function UserWidget() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getAccessToken("spotify_token");

        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener datos del usuario");

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getAccessToken]);

  if (loading) {
    return (
      <div className="p-4 bg-neutral-800 text-white rounded shadow text-center">
        Cargando información del usuario...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-600 text-white rounded shadow text-center">
        {error}
      </div>
    );
  }

  if (!userData) return null;

return (
  <>
    <DashboardHeader />

    <div className="flex justify-center items-center min-h-screen bg-neutral-900 p-4">
      <div className="max-w-md w-full p-6 bg-neutral-800 text-white rounded-lg shadow-md flex flex-col items-center gap-4">
        {userData.images?.[0]?.url && (
          <Image
            src={userData.images[0].url}
            alt={userData.display_name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        )}

        <h2 className="text-xl font-bold">{userData.display_name}</h2>
        <p className="text-gray-300">{userData.email}</p>
        <p className="text-gray-300">País: {userData.country}</p>
        <p className="text-gray-300">Plan: {userData.product}</p>
      </div>
    </div>
  </>
);

}
