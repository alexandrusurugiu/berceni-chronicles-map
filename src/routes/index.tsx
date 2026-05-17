import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { POIS, type POI } from "@/data/pois";
import StoryDialog from "@/components/StoryDialog";
import AddStoryDialog, { type UserStory } from "@/components/AddStoryDialog";

const HeritageMap = lazy(() => import("@/components/HeritageMap"));

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Berceni Povestit · Hartă interactivă a cartierului" },
      {
        name: "description",
        content:
          "Descoperă istoria cartierului Berceni, a Parcului Tineretului și a Orășelului Copiilor printr-o hartă interactivă cu povești și fun facts.",
      },
    ],
  }),
});

const STORAGE_KEY = "berceni-user-stories";

function Index() {
  const [selected, setSelected] = useState<POI | null>(null);
  const [adding, setAdding] = useState(false);
  const [userStories, setUserStories] = useState<UserStory[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUserStories(JSON.parse(raw));
    } catch {}
  }, []);

  function saveStory(s: UserStory) {
    const next = [s, ...userStories];
    setUserStories(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setAdding(false);
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-6 pb-6 pt-10 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-type text-xs uppercase tracking-[0.4em] text-sepia">
            Arhivă vie · București · sectorul 4
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-ink sm:text-7xl">
            Berceni <span className="italic text-accent">povestit</span>
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-ink/80 sm:text-xl">
            O hartă desenată pe hârtie veche a sudului Bucureștiului — de la
            mlaștina Cocioc la blocurile Berceniului. Apasă pe pinii cu cerneală
            pentru a citi poveștile și a afla lucruri pe care, poate, nu le știai.
          </p>
        </div>
      </header>

      {/* Map + sidebar */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-12 lg:grid-cols-[1fr_320px]">
        <div className="paper-card relative h-[520px] overflow-hidden sm:h-[640px]">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center font-display text-2xl text-sepia">
                Se desfășoară harta…
              </div>
            }
          >
            <HeritageMap onSelect={setSelected} />
          </Suspense>

          <button
            onClick={() => setAdding(true)}
            className="absolute right-4 top-4 z-[400] rounded-sm bg-accent px-5 py-3 font-display text-base font-semibold uppercase tracking-wider text-accent-foreground shadow-lg transition-transform hover:scale-105"
          >
            + Adaugă povestea ta
          </button>
        </div>

        <aside className="paper-card p-6">
          <h2 className="font-display text-2xl font-bold text-ink">
            Puncte de interes
          </h2>
          <p className="mt-1 font-body italic text-sepia">
            Cinci locuri, cinci epoci.
          </p>
          <ol className="mt-5 space-y-3">
            {POIS.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p)}
                  className="group flex w-full items-start gap-3 rounded-sm border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-paper-dark/30"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className="font-type text-xs uppercase tracking-wider text-sepia">
                      {p.year}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* User stories */}
      {userStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-12">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Poveștile cititorilor
          </h2>
          <p className="mt-1 font-body italic text-sepia">
            Adăugate de oameni ca tine.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {userStories.map((s) => (
              <article key={s.id} className="paper-card p-5">
                {s.image && (
                  <img
                    src={s.image}
                    alt={`Poza adăugată de ${s.name}`}
                    className="sepia-img mb-3 h-40 w-full rounded-sm border border-border object-cover"
                    loading="lazy"
                  />
                )}
                <h3 className="font-display text-xl font-bold text-ink">
                  {s.name}
                </h3>
                <p className="mt-2 whitespace-pre-line font-body text-ink/90">
                  {s.story}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border px-6 py-8 sm:px-12">
        <p className="mx-auto max-w-7xl font-type text-xs uppercase tracking-[0.3em] text-sepia">
          Arhivă vie · poveștile sunt salvate local în browserul tău
        </p>
      </footer>

      {selected && (
        <StoryDialog poi={selected} onClose={() => setSelected(null)} />
      )}
      {adding && (
        <AddStoryDialog onClose={() => setAdding(false)} onSubmit={saveStory} />
      )}
    </main>
  );
}
