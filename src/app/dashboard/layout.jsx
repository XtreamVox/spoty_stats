// app/dashboard/layout.jsx
"use client";

import DashboardProvider  from "./DashboardContext";
import PlaylistGenerator from "./playlistGenerator";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-neutral-900 text-white">
        <DashboardHeader ></DashboardHeader>
        <PlaylistGenerator></PlaylistGenerator>
        {children}
      </div>
    </DashboardProvider>
  );
}

