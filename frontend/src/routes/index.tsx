import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { POIS, type POI } from "@/data/pois";
import StoryDialog from "@/components/StoryDialog";
import AddStoryDialog, { type UserStory } from "@/components/AddStoryDialog";
import ExplorerJournal, { TASK_POOL } from "@/components/ExplorerJournal";

const HeritageMap = lazy(() => import("@/components/HeritageMap"));

export const Route = createFileRoute("/")({ component: Index });

const STORAGE_KEY = "berceni-user-stories";
const TASKS_KEY = "berceni-tasks-v3";
const QUEST_STATE_KEY = "berceni-quest-started";

// Mapăm ID-urile de task GPS cu ID-urile din baza de date POIS
const TASK_POI_MAP: Record<string, string> = {
  find_cocioc: "cocioc",
  find_imgb: "imgb",
  find_vacaresti: "vacaresti",
  find_cenusa: "cenusa",
  find_trenulet: "trenulet",
  find_pod: "pod_tineretului",
  find_palat: "palatul_copiilor",
  find_debarcader: "debarcader",
  find_eroi: "eroii_revolutiei"
};

// Formula matematică Haversine pentru a calcula distanța în metri între 2 puncte GPS
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Raza Pământului în metri
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Index() {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [selectedUserStory, setSelectedUserStory] = useState<UserStory | null>(null);
  const [addingLocation, setAddingLocation] = useState<{lat: number, lng: number} | null>(null);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  
  // NOU: Stări pentru Quest și GPS
  const [questStarted, setQuestStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // 1. Inițializare la prima încărcare
  useEffect(() => {
    setIsClient(true);
    try {
      const rawStories = localStorage.getItem(STORAGE_KEY);
      if (rawStories) setUserStories(JSON.parse(rawStories));

      const savedQuestState = localStorage.getItem(QUEST_STATE_KEY);
      if (savedQuestState === "true") setQuestStarted(true);

      const rawTasks = localStorage.getItem(TASKS_KEY);
      let parsedTasks = rawTasks ? JSON.parse(rawTasks) : null;

      if (parsedTasks && Object.keys(parsedTasks).length > 0) {
        setTasks(parsedTasks);
      } else {
        const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        const initialTasks: Record<string, boolean> = {};
        selected.forEach(t => initialTasks[t.id] = false);
        setTasks(initialTasks);
        localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
      }
    } catch {}

    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Logica GPS - Urmărește utilizatorul live doar dacă quest-ul e pornit
  useEffect(() => {
    if (!isClient || !questStarted) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Verificăm dacă suntem aproape de un obiectiv activ din jurnal
        setTasks(prevTasks => {
          let updatedTasks = { ...prevTasks };
          let tasksChanged = false;

          Object.keys(prevTasks).forEach(taskId => {
            if (!prevTasks[taskId] && TASK_POI_MAP[taskId]) {
              const targetPoiId = TASK_POI_MAP[taskId];
              const targetPoi = POIS.find(p => p.id === targetPoiId);
              
              if (targetPoi) {
                const distance = getDistanceInMeters(latitude, longitude, targetPoi.lat, targetPoi.lng);
                
                // TOLERANȚĂ DE 50 METRI PENTRU CHECK-IN
                if (distance <= 50) { 
                  updatedTasks[taskId] = true;
                  tasksChanged = true;
                  // Deschidem automat povestea când e găsită și felicităm utilizatorul!
                  setTimeout(() => {
                    alert(`Felicitări! Ai ajuns la ${targetPoi.name}! Ai deblocat istoria acestui loc.`);
                    setSelectedPoi(targetPoi);
                  }, 500);
                }
              }
            }
          });

          if (tasksChanged) {
            localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
            return updatedTasks;
          }
          return prevTasks;
        });
      },
      (error) => {
        console.warn("Eroare GPS: Ai dat permisiunea de locație?", error);
        alert("Eroare: Nu putem accesa locația ta GPS. Verifică permisiunile browserului!");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isClient, questStarted]); // Rulează din nou dacă pornește quest-ul

  function handleStartQuest() {
    // Cerem permisiunea browserului
    if ("geolocation" in navigator) {
      setQuestStarted(true);
      localStorage.setItem(QUEST_STATE_KEY, "true");
    } else {
      alert("Browserul tău nu suportă localizarea GPS.");
    }
  }

  function completeTask(taskId: string) {
    setTasks(prev => {
      if (prev[taskId] === undefined || prev[taskId] === true) return prev;
      const next = { ...prev, [taskId]: true };
      localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      return next;
    });
  }

  function handleSelectPoi(p: POI) {
    setSelectedPoi(p);
    // Taskurile de mișcare (find_) se fac automat prin GPS acum.
    // Lăsăm aici o portiță secretă pentru testare dacă e cazul, dar ideal utilizatorul
    // trebuie să MEARGĂ fizic acolo pentru a debloca misiunile find_*!
  }

  function saveStory(s: UserStory) {
    const next = [s, ...userStories];
    setUserStories(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAddingLocation(null);
    completeTask("add_story");
  }

  function handleEditStory(updatedStory: UserStory) {
    const next = userStories.map(s => s.id === updatedStory.id ? updatedStory : s);
    setUserStories(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditingStory(null);
    completeTask("edit_story");
  }

  function handleDeleteStory(id: string) {
    if (window.confirm("Ești sigur că vrei să ștergi această amintire definitiv?")) {
      const next = userStories.filter(s => s.id !== id);
      setUserStories(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  return (
    <main className="min-h-screen relative pb-20">
      <header className="border-b border-border px-6 pb-6 pt-10 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-type text-xs uppercase tracking-[0.4em] text-sepia">
            Arhivă vie · Parcul Tineretului · Orășelul Copiilor
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-ink sm:text-7xl">
            Tineretului <span className="italic text-accent">de altădată</span>
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-ink/80 sm:text-xl">
            O hartă desenată pe hârtie veche dedicată memoriei Parcului Tineretului și magiei din Orășelul Copiilor. De la fosta mlaștină Cocioc până la legendarul trenuleț. Deschide Jurnalul de Explorator și pornește fizic la pas prin parc pentru a debloca istoria!
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-12 lg:grid-cols-[1fr_320px]">
        <div className="paper-card relative h-[520px] overflow-hidden sm:h-[640px]">
          {isClient ? (
            <Suspense fallback={<div className="flex h-full items-center justify-center font-display text-2xl text-sepia">Se desfășoară harta…</div>}>
              <HeritageMap 
                onSelect={handleSelectPoi}
                onSelectUserStory={setSelectedUserStory}
                onMapClick={(lat, lng) => setAddingLocation({ lat, lng })}
                userStories={userStories}
                userLocation={userLocation} // NOU: Pasăm locația Live a utilizatorului
              />
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center font-display text-2xl text-sepia">Se pregătesc documentele...</div>
          )}
          <div className="pointer-events-none absolute right-4 top-4 z-[400] rounded-sm bg-accent/90 px-5 py-3 font-display text-base font-semibold uppercase tracking-wider text-accent-foreground shadow-lg backdrop-blur-sm">
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
                  onClick={() => handleSelectPoi(p)}
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

      {userStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-12">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Poveștile cititorilor</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {userStories.map((s) => {
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
                  
                  <div className="mt-4 pt-3 border-t border-sepia/30 flex justify-end gap-4">
                    <button onClick={() => setEditingStory(s)} className="font-display text-sm font-semibold uppercase text-accent hover:text-ink transition-colors">
                      ✎ Editează
                    </button>
                    {isWithinFiveMinutes && (
                      <button onClick={() => handleDeleteStory(s.id)} className="font-display text-sm font-semibold uppercase text-red-700/80 hover:text-red-900 transition-colors">
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

      {selectedPoi && <StoryDialog item={selectedPoi} onClose={() => setSelectedPoi(null)} onReadFacts={() => completeTask("read_facts")} />}
      {selectedUserStory && <StoryDialog item={selectedUserStory} isUserStory={true} onClose={() => setSelectedUserStory(null)} onReadFacts={() => completeTask("read_facts")} />}
      
      {addingLocation && <AddStoryDialog latitude={addingLocation.lat} longitude={addingLocation.lng} onClose={() => setAddingLocation(null)} onSubmit={saveStory} />}
      {editingStory && <AddStoryDialog latitude={editingStory.lat} longitude={editingStory.lng} initialData={editingStory} onClose={() => setEditingStory(null)} onSubmit={handleEditStory} />}

      {/* JURNALUL COMANDĂ TOT ACUM */}
      <ExplorerJournal tasks={tasks} questStarted={questStarted} onStartQuest={handleStartQuest} />
    </main>
  );
}