"use client";

import { useState } from "react";
import { DECADES } from "./decades";
import DecadeDialog from "./decade_dialogue";   // ← Aquí estaba el error
import "./decade_widget.css";

export default function DecadeWidget() {
  const [openDecade, setOpenDecade] = useState(null);

  const handleClick = (decade) => {
    console.log("Se ha pulsado la década:", decade);
    setOpenDecade(decade);  // Guardamos el objeto completo
  };

  const handleClose = () => {
    setOpenDecade(null);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[60vh] p-4">
      {/*Crear los bloques */}
      {DECADES.map((decade) => (
        <div
          key={decade.id}
          className="bg-neutral-800 text-white flex items-center justify-center text-2xl rounded-lg cursor-pointer hover:bg-neutral-700 transition"
          onClick={() => handleClick(decade)}
        >
          {decade.label}
        </div>
      ))}

      {/*Creación de dialogos*/}
      {openDecade && (
        <DecadeDialog
          open={!!openDecade}
          onClose={handleClose}
          decade={openDecade}  
          tracks={[]}
        />
      )}
    </div>
  );
}
