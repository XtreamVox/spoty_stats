"use client";

export default function GenreDialog({ open, onClose, genre, tracks }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 text-white rounded-xl shadow-xl p-6 w-[80vw] max-w-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4 text-center">{genre.label}</h2>

        {tracks.length === 0 ? (
          <p className="text-neutral-400 text-center">Cargando tracks...</p>
        ) : (
          <ul className="space-y-2">
            {tracks.map((t) => (
              <li
                key={t.id}
                className="p-2 bg-neutral-800 rounded-lg flex justify-between items-center"
              >
                {t.name} — {t.artists.map((a) => a.name).join(", ")}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
