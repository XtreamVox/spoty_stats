"use client";

import { useDashboard } from "../../DashboardContext";
import { MOOD_GENRE_MAP } from "./moods";

export default function MoodWidget() {
  const { preferences, togglePreferenceItem } = useDashboard();

  // preferences.mood será un objeto del tipo { id: "Sad", name: "Sad" }
  const selectedMoodId = preferences.mood?.id || null;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.keys(MOOD_GENRE_MAP).map((mood) => {
        const isSelected = selectedMoodId === mood;

        return (
          <div
            key={mood}
            className={`relative bg-neutral-800 text-white flex flex-col items-center justify-center rounded-lg cursor-pointer transition transform hover:scale-105 hover:bg-neutral-700 ${
              isSelected
                ? "ring-2 ring-green-400 border-green-500 border"
                : "border-transparent"
            } min-h-[150px]`}
            onClick={() =>
              togglePreferenceItem(
                "mood",
                { id: mood, name: mood },
                false // ÚNICO valor
              )
            }
          >
            <span className="text-2xl font-semibold">{mood}</span>

            <button
              className="mt-3 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
              onClick={(e) => {
                e.stopPropagation();
                togglePreferenceItem(
                  "mood",
                  { id: mood, name: mood },
                  false
                );
              }}
            >
              {isSelected ? "Quitar mood" : "Seleccionar mood"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
