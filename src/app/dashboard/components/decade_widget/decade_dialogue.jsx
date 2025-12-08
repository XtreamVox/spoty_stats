"use client";
import { useEffect, useRef } from "react";

export default function DecadeDialog({ open, onClose, decade, tracks }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (serie && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [open]);
}