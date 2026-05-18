import React from "react";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-sm border-2 border-sepia bg-paper p-6 shadow-[0_10px_40px_rgba(40,15,10,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
        <p className="mt-3 font-body text-ink/80">{message}</p>
        
        <div className="mt-8 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-sm border border-sepia/50 px-4 py-2 font-display uppercase text-sm font-semibold text-ink transition-colors hover:bg-sepia/10"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            className="rounded-sm bg-red-800 px-4 py-2 font-display uppercase text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-900"
          >
            Da, Șterge
          </button>
        </div>
      </div>
    </div>
  );
}