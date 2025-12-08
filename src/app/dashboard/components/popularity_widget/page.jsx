"use client";

import { POPULARITY_RANGES } from "./popularity";
import { useDashboard } from "../../DashboardContext";
import { useState } from "react";
import PopularityDialog from "./popularity_dialogue";


export default function PopularityWidget() {
  const { togglePreferenceItem } = useDashboard();

  const [openRange, setOpenRange] = useState(null);

  const handleClick = (range) => {
    setOpenRange(range);
  };

  const handleClose = () => {
    setOpenRange(null);
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[60vh] p-4">
      {POPULARITY_RANGES.map((range) => (
        <div
          key={range.id}
          className="bg-neutral-800 text-white flex flex-col items-center justify-center text-2xl rounded-lg cursor-pointer hover:bg-neutral-700 transition p-4"
          onClick={() => handleClick(range)}
        >
          <span className="mb-2">{range.label}</span>

          <button
            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePreferenceItem("popularity", range);
            }}
          >
            Añadir a Preferencias
          </button>
        </div>
      ))}

      {openRange && (
        <PopularityDialog
          open
          onClose={handleClose}
          range={openRange}
        ></PopularityDialog>
      )}
    </div>
  );
}
