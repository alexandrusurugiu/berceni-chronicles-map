import { useState } from "react";

export type UserStory = {
  id: string;
  name: string;
  story: string;
  image?: string;
  createdAt: number;
};

type Props = {
  onClose: () => void;
  onSubmit: (s: UserStory) => void;
};

export default function AddStoryDialog({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !story.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      story: story.trim(),
      image,
      createdAt: Date.now(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "oklch(0.2 0.04 50 / 0.65)" }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="paper-card deckle-edge relative max-h-[90vh] w-full max-w-xl overflow-y-auto p-8 sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-sepia hover:text-accent"
          aria-label="Închide"
        >
          ✕
        </button>

        <p className="font-type text-xs uppercase tracking-[0.3em] text-sepia">
          Arhiva vie a cartierului
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Adaugă povestea ta
        </h2>
        <p className="mt-2 font-body italic text-sepia">
          Fiecare amintire scrisă aici devine parte din istoria locului.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              Numele tău
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ion Popescu"
              className="mt-2 w-full rounded-sm border border-border bg-paper-dark/30 px-4 py-3 font-body text-lg text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <label className="block">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              Povestea ta
            </span>
            <textarea
              required
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Îmi aduc aminte cum, în vara lui '87, bunicul mă ducea cu trenulețul Pufuleț…"
              className="mt-2 w-full rounded-sm border border-border bg-paper-dark/30 px-4 py-3 font-body text-lg leading-relaxed text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <label className="block cursor-pointer">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              O poză (opțional)
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-sm border border-dashed border-sepia/60 bg-paper-dark/20 px-4 py-4 hover:border-accent">
              <span className="font-type text-2xl">📎</span>
              <span className="font-body text-ink/80">
                {fileName || "Alege o fotografie de epocă sau actuală"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="sr-only"
              />
            </div>
            {image && (
              <img
                src={image}
                alt="Previzualizare"
                className="sepia-img mt-3 max-h-48 rounded-sm border border-border"
              />
            )}
          </label>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-sm bg-accent px-6 py-3 font-display text-lg font-semibold uppercase tracking-wider text-accent-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-accent/90"
          >
            Adaugă în arhivă
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-border bg-paper-dark/30 px-6 py-3 font-display text-lg text-ink hover:bg-paper-dark/60"
          >
            Renunță
          </button>
        </div>
      </form>
    </div>
  );
}
