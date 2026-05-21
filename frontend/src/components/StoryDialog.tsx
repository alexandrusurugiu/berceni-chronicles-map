import { useState, useEffect } from "react";
import type { POI } from "@/data/pois";
import type { UserStory } from "@/components/AddStoryDialog";
import { API_URL } from "@/lib/api";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

type Props = { 
  item: POI | UserStory; 
  isUserStory?: boolean;
  onClose: () => void; 
  onReadFacts?: () => void;
};

export default function StoryDialog({ item, isUserStory, onClose, onReadFacts }: Props) {
  const [tab, setTab] = useState<"story" | "facts">("story");

  useEffect(() => {
      if (tab === "facts" && onReadFacts) {
        onReadFacts();
      }
    }, [tab, onReadFacts]);

  const funFacts = item.funFacts || [];
  const hasFacts = funFacts.length > 0;
  
  const subtitle = isUserStory 
    ? `Adăugat la: ${new Date((item as UserStory).createdAt).toLocaleDateString('ro-RO')}` 
    : `Berceni · ${(item as POI).year}`;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      style={{ backgroundColor: "oklch(0.2 0.04 50 / 0.65)" }}
      onClick={onClose}
    >
      <article
        className="paper-card deckle-edge relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl text-sepia hover:text-accent" aria-label="Închide">✕</button>

        <p className="font-type text-xs uppercase tracking-[0.3em] text-sepia">
          {subtitle}
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          {item.name}
        </h2>

        {item.image && (
          <div className="mt-6">
            {("imageNew" in item && item.imageNew) ? (
              <BeforeAfterSlider 
                image={item.image} 
                imageNew={item.imageNew} 
                altText={item.name} 
              />
            ) : (
              <div className="overflow-hidden rounded-sm border border-border shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="sepia-img h-auto w-full max-h-[400px] object-cover"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("story")}
            className={`px-4 py-2 font-display text-lg transition-colors ${
              tab === "story" ? "border-b-2 border-accent text-ink" : "text-sepia hover:text-ink"
            }`}
          >
            Povestea locului
          </button>
          
          {/* Arătăm butonul de fapte doar dacă avem cel puțin unul adăugat */}
          {hasFacts && (
            <button
              onClick={() => setTab("facts")}
              className={`px-4 py-2 font-display text-lg transition-colors ${
                tab === "facts" ? "border-b-2 border-accent text-ink" : "text-sepia hover:text-ink"
              }`}
            >
              Știai că... ({funFacts.length})
            </button>
          )}
        </div>

        {tab === "story" ? (
          <p className="mt-5 whitespace-pre-line font-body text-lg leading-relaxed text-ink/90">
            {item.story}
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {funFacts.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-display text-2xl font-bold text-accent">№{i + 1}</span>
                <span className="font-body text-lg leading-relaxed text-ink/90">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}