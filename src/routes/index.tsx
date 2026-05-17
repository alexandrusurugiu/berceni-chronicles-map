import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { POIS, type POI } from "@/data/pois";
import StoryDialog from "@/components/StoryDialog";
import AddStoryDialog, { type UserStory } from "@/components/AddStoryDialog";
import ExplorerJournal, { TASK_POOL } from "@/components/ExplorerJournal"; // MODIFICAT: Importăm și POOL-ul

const HeritageMap = lazy(() => import("@/components/HeritageMap"));

export const Route = createFileRoute("/")({
  component: Index,
});

const STORAGE_KEY = "berceni-user-stories";
const TASKS_KEY = "berceni-tasks-v2";

function Index() {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [selectedUserStory, setSelectedUserStory] = useState<UserStory | null>(null); // NOU
  const [addingLocation, setAddingLocation] = useState<{lat: number, lng: number} | null>(null);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsClient(true);
    try {
      const rawStories = localStorage.getItem(STORAGE_KEY);
      if (rawStories) setUserStories(JSON.parse(rawStories));

      const rawTasks = localStorage.getItem(TASKS_KEY);
      if (rawTasks) {
        setTasks(JSON.parse(rawTasks));
      } else {
        // Dacă nu are task-uri salvate, ALEGEM 3 RANDOM din POOL
        const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3); // Luăm primele 3
        
        const initialTasks: Record<string, boolean> = {};
        selected.forEach(t => initialTasks[t.id] = false);
        
        setTasks(initialTasks);
        localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
      }
    } catch {}

    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  function completeTask(taskId: string) {
    setTasks(prev => {
      if (prev[taskId] === undefined) return prev; // Dacă a nimerit un task pe care NU îl are în listă, nu facem nimic
      if (prev[taskId] === true) return prev;      // Deja terminat
      
      const next = { ...prev, [taskId]: true };
      localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      return next;
    });
  }

  function handleSelectPoi(p: POI) {
    setSelectedPoi(p);
    // Verificăm ce a deschis și declanșăm task-ul corespunzător
    if (p.id === "cocioc") completeTask("find_cocioc");
    if (p.id === "cenusa") completeTask("find_cenusa"); // NOU
    if (p.id === "pod_tineretului") completeTask("find_pod"); // NOU
  }

  function saveStory(s: UserStory) {
    const next = [s, ...userStories];
    setUserStories(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAddingLocation(null);
    completeTask("add_story"); // Trigger Task Adăugare
  }

  // NOU: Funcție pentru editare
  function handleEditStory(updatedStory: UserStory) {
    const next = userStories.map(s => s.id === updatedStory.id ? updatedStory : s);
    setUserStories(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditingStory(null);
    completeTask("edit_story"); // Trigger Task Editare
  }

  // NOU: Funcție pentru ștergere
  function handleDeleteStory(id: string) {
    if (window.confirm("Ești sigur că vrei să ștergi această amintire definitiv?")) {
      const next = userStories.filter(s => s.id !== id);
      setUserStories(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  return (
    <main className="min-h-screen relative pb-20">
      {/* HEADERUL RĂMÂNE LA FEL */}
      <header className="border-b border-border px-6 pb-6 pt-10 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-type text-xs uppercase tracking-[0.4em] text-sepia">Arhivă vie · București · sectorul 4</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-ink sm:text-7xl">
            Tineretului de <span className="italic text-accent">altădată</span>
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-ink/80 sm:text-xl">
            Descoperă istoria Parcului Tineretului și a Orășelului Copiilor printr-o hartă interactivă cu povești și curiozități din Bucureștiul de altădată.
          </p>
        </div>
      </header>

      {/* SECTIUNEA HĂRȚII RĂMÂNE LA FEL */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-12 lg:grid-cols-[1fr_320px]">
        <div className="paper-card relative h-[520px] overflow-hidden sm:h-[640px]">
          {isClient ? (
            <Suspense fallback={<div className="flex h-full items-center justify-center...">Se desfășoară harta…</div>}>
              <HeritageMap 
                onSelect={handleSelectPoi} // FIX: Aici era setSelectedPoi înainte!
                onSelectUserStory={setSelectedUserStory}
                onMapClick={(lat, lng) => setAddingLocation({ lat, lng })}
                userStories={userStories}
              />
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center font-display text-2xl text-sepia">Se pregătesc documentele...</div>
          )}
          <div className="absolute right-4 top-4 z-[400] rounded-sm bg-accent/90 px-5 py-3 font-display text-base font-semibold uppercase tracking-wider text-accent-foreground shadow-lg backdrop-blur-sm">
            📍 Dă click pe hartă pentru a adăuga
          </div>
        </div>

        <aside className="paper-card p-6 flex flex-col h-[520px] sm:h-[640px]">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Puncte de interes</h2>
            <p className="mt-1 font-body italic text-sepia">Istoria la pas, prin {POIS.length} locuri.</p>
          </div>
          <ol className="mt-5 space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {POIS.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => handleSelectPoi(p)} // FIX: Aici era setSelectedPoi înainte!
                  className="group flex w-full items-start gap-3 rounded-sm border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-paper-dark/30"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">{i + 1}</span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink group-hover:text-accent">{p.name}</span>
                    <span className="font-type text-xs uppercase tracking-wider text-sepia">{p.year}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* MODIFICAT: SECȚIUNEA UNDE AFIȘĂM POVEȘTILE UTILIZATORILOR */}
      {userStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-12">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Poveștile cititorilor</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {userStories.map((s) => {
              // Calculăm dacă au trecut mai puțin de 5 minute (5 * 60 * 1000 ms = 300000)
              const isWithinFiveMinutes = (currentTime - s.createdAt) <= 300000;

              return (
                <article key={s.id} className="paper-card p-5 flex flex-col justify-between">
                  <div>
                    {s.image && <img src={s.image} alt="" className="sepia-img mb-3 h-40 w-full rounded-sm border border-border object-cover" loading="lazy" />}
                    <h3 className="font-display text-xl font-bold text-ink">{s.name}</h3>
                    {s.lat !== undefined && s.lng !== undefined && (
                      <p className="font-type text-xs text-sepia mb-2">📍 {s.lat.toFixed(4)}, {s.lng.toFixed(4)}</p>
                    )}
                    <p className="mt-2 whitespace-pre-line font-body text-ink/90">{s.story}</p>
                  </div>
                  
                  {/* NOU: Butoanele de acțiuni la baza cardului */}
                  <div className="mt-4 pt-3 border-t border-sepia/30 flex justify-end gap-4">
                    <button 
                      onClick={() => setEditingStory(s)} 
                      className="font-display text-sm font-semibold uppercase text-accent hover:text-ink transition-colors"
                    >
                      ✎ Editează
                    </button>
                    {isWithinFiveMinutes && (
                      <button 
                        onClick={() => handleDeleteStory(s.id)} 
                        className="font-display text-sm font-semibold uppercase text-red-700/80 hover:text-red-900 transition-colors"
                      >
                        ✕ Șterge
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Modale pentru afișarea poveștilor detaliate (și oficiale și de la useri) */}
      {selectedPoi && (
        <StoryDialog 
          item={selectedPoi} 
          onClose={() => setSelectedPoi(null)} 
          onReadFacts={() => completeTask("read_facts")} // Trigger Task Funcție
        />
      )}
      {selectedUserStory && (
        <StoryDialog 
          item={selectedUserStory} 
          isUserStory={true} 
          onClose={() => setSelectedUserStory(null)} 
          onReadFacts={() => completeTask("read_facts")} // Trigger Task Funcție
        />
      )}
      
      {/* Modal pentru ADĂUGARE */}
      {addingLocation && <AddStoryDialog latitude={addingLocation.lat} longitude={addingLocation.lng} onClose={() => setAddingLocation(null)} onSubmit={saveStory} />}
      {editingStory && <AddStoryDialog latitude={editingStory.lat} longitude={editingStory.lng} initialData={editingStory} onClose={() => setEditingStory(null)} onSubmit={handleEditStory} />}

      <ExplorerJournal tasks={tasks} />    
    </main>
  );
}