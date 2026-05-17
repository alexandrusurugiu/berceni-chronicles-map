import { useState } from "react";

export type UserStory = {
  id: string;
  name: string;
  story: string;
  image?: string;
  lat: number;
  lng: number;
  createdAt: number;
  funFacts?: string[]; // NOU: Array opțional pentru curiozități
};

type Props = {
  latitude: number;
  longitude: number;
  initialData?: UserStory;
  onClose: () => void;
  onSubmit: (s: UserStory) => void;
};

export default function AddStoryDialog({ latitude, longitude, initialData, onClose, onSubmit }: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [story, setStory] = useState(initialData?.story || "");
  const [image, setImage] = useState<string | undefined>(initialData?.image);
  const [fileName, setFileName] = useState<string>("");
  
  // NOU: Stare pentru fun facts
  const [funFacts, setFunFacts] = useState<string[]>(initialData?.funFacts || []);

  const isEditing = !!initialData;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  // NOU: Funcții pentru a manipula lista de fun facts
  const addFact = () => setFunFacts([...funFacts, ""]);
  const updateFact = (index: number, val: string) => {
    const next = [...funFacts];
    next[index] = val;
    setFunFacts(next);
  };
  const removeFact = (index: number) => {
    setFunFacts(funFacts.filter((_, i) => i !== index));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !story.trim()) return;
    
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name: name.trim(),
      story: story.trim(),
      image,
      lat: initialData?.lat || latitude,
      lng: initialData?.lng || longitude,
      createdAt: initialData?.createdAt || Date.now(),
      // Curățăm input-urile goale înainte să salvăm
      funFacts: funFacts.filter(f => f.trim() !== ""), 
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
          {isEditing ? "Editează povestea" : "Adaugă povestea ta"}
        </h2>
        <p className="mt-2 font-body italic text-sepia">
          {isEditing ? "Modifică detaliile amintirii tale." : "Fiecare amintire scrisă aici devine parte din istoria locului."}
        </p>

        {latitude !== undefined && longitude !== undefined && (
          <div className="mt-4 inline-block rounded bg-paper-dark/50 px-3 py-1 font-type text-sm text-sepia">
            📍 Locație: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </div>
        )}

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Numele tău (sau titlul)</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Amintiri din 1989"
              className="mt-2 w-full rounded-sm border border-border bg-paper-dark/30 px-4 py-3 font-body text-lg text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <label className="block cursor-pointer">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">O poză (opțional)</span>
            <div className="mt-2 flex items-center gap-3 rounded-sm border border-dashed border-sepia/60 bg-paper-dark/20 px-4 py-4 hover:border-accent">
              <span className="font-type text-2xl">📎</span>
              <span className="font-body text-ink/80">{fileName || (image ? "Schimbă poza actuală" : "Alege o fotografie")}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
            </div>
            {image && <img src={image} alt="Previzualizare" className="sepia-img mt-3 max-h-48 rounded-sm border border-border" />}
          </label>

          <label className="block">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Povestea locului</span>
            <textarea
              required
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Îmi aduc aminte cum..."
              className="mt-2 w-full rounded-sm border border-border bg-paper-dark/30 px-4 py-3 font-body text-lg leading-relaxed text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>

          {/* NOU: Secțiunea pentru Fun Facts */}
          <div className="block pt-2">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              Știai că... (Curiozități opționale)
            </span>
            
            {/* Container pentru inputuri cu spațiere verticală generoasă */}
            <div className="mt-3 space-y-3">
              {funFacts.map((fact, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={fact}
                    onChange={(e) => updateFact(i, e.target.value)}
                    placeholder="Ex: Acest bloc a fost construit în doar 3 luni..."
                    className="w-full rounded-sm border border-border bg-paper-dark/30 px-4 py-2 font-body text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeFact(i)} 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-transparent text-xl font-bold text-red-700/80 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-900"
                    title="Șterge curiozitatea"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            {/* Butonul de adăugare distanțat și stilizat cu border dashed */}
            <button 
              type="button" 
              onClick={addFact} 
              className="mt-5 inline-block rounded-sm border border-dashed border-accent/60 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/10 hover:text-ink"
            >
              + Adaugă o curiozitate
            </button>
          </div>
        </div> {/* <-- ACESTA ESTE DIV-UL CARE LIPSEA (închide mt-6 space-y-5) */}

        {/* <-- AICI SUNT BUTOANELE CARE LIPSEAU --> */}
        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-sm bg-accent px-6 py-3 font-display text-lg font-semibold uppercase tracking-wider text-accent-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-accent/90"
          >
            {isEditing ? "Salvează modificările" : "Adaugă în arhivă"}
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