"use client";

import { useState } from "react";
import { POPULARITY_RANGES } from "./popularity";
import { useDashboard } from "../../DashboardContext";
import PopularityDialog from "./popularity_dialogue";

export default function PopularityWidget() {
  const { togglePreferenceItem, preferences } = useDashboard();

  const [openRange, setOpenRange] = useState(null);

  const handleClick = (range) => {
    setOpenRange(range);
  };

  const handleClose = () => {
    setOpenRange(null);
  };

  const isSelected = (range) =>
    preferences?.popularity?.id === range.id;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {POPULARITY_RANGES.map((range) => (
        <div
          key={range.id}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") handleClick(range); }}
          onClick={() => handleClick(range)}
          className={`relative bg-neutral-800 text-white flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-neutral-700 p-4 min-h-[140px] max-h-40 hover:scale-101 max-w-full overflow-hidden ${
            isSelected(range)
              ? "ring-2 ring-green-400 border-green-500 border"
              : "border-transparent"
          }`}
        >
          <span className="mb-2 text-lg font-semibold text-center">{range.label}</span>

          <button
            type="button"
            className="mt-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
            onClick={(e) => {
              e.stopPropagation();
                togglePreferenceItem("popularity", range, false);
            }}
          >
            {isSelected(range) ? "Seleccionada" : "Añadir a preferencias"}
          </button>
        </div>
      ))}

      {openRange && (
        <PopularityDialog
          open={!!openRange}
          onClose={handleClose}
          range={openRange}
        />
      )}
    </div>
  );
}
