import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { POIS, type POI } from "@/data/pois";
import StoryDialog from "@/components/StoryDialog";
import AddStoryDialog, { type UserStory } from "@/components/AddStoryDialog";
import ExplorerJournal, { TASK_POOL } from "@/components/ExplorerJournal";
import { API_URL } from "@/lib/api";

const HeritageMap = lazy(() => import("@/components/HeritageMap"));
export const Route = createFileRoute("/")({ component: Index });

function getUserId() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "server-render-id"; 
  }

  let uid = localStorage.getItem("berceni-user-id");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("berceni-user-id", uid);
  }
  return uid;
}

const TASK_POI_MAP: Record<string, string> = {
  find_cocioc: "cocioc", find_imgb: "imgb", find_vacaresti: "vacaresti",
  find_cenusa: "cenusa", find_trenulet: "trenulet", find_pod: "pod_tineretului",
  find_palat: "palatul_copiilor", find_sincai: "sincai",
  find_debarcader: "debarcader", find_eroi: "eroii_revolutiei"
};

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
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
  const [questStarted, setQuestStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const userId = getUserId();

  useEffect(() => {
    setIsClient(true);
    
    const fetchStories = () => {
      fetch(`${API_URL}/api/stories`)
        .then(res => res.json())
        .then(data => setUserStories(data))
        .catch(console.error);
    };

    fetchStories();

    const pollingInterval = setInterval(fetchStories, 5000);

    fetch(`${API_URL}/api/quest/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setQuestStarted(data.started);
          setTasks(data.tasks);
        } else {
          const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3);
          const initialTasks: Record<string, boolean> = {};
          selected.forEach(t => initialTasks[t.id] = false);
          setTasks(initialTasks);
          
          syncQuestToDB(false, initialTasks);
        }
      })
      .catch(console.error);

    const timeInterval = setInterval(() => setCurrentTime(Date.now()), 60000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(pollingInterval); 
    };
  }, []);

  const syncQuestToDB = (started: boolean, currentTasks: Record<string, boolean>) => {
    fetch(`${API_URL}/quest/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ started, tasks: currentTasks })
    }).catch(console.error);
  };

  useEffect(() => {
    if (!isClient || !questStarted) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        let tasksChanged = false;
        const updatedTasks = { ...tasks };

        Object.keys(updatedTasks).forEach(taskId => {
          if (!updatedTasks[taskId] && TASK_POI_MAP[taskId]) {
            const targetPoi = POIS.find(p => p.id === TASK_POI_MAP[taskId]);
            if (targetPoi && getDistanceInMeters(latitude, longitude, targetPoi.lat, targetPoi.lng) <= 50) { 
              updatedTasks[taskId] = true;
              tasksChanged = true;
              setTimeout(() => {
                alert(`Felicitări! Ai ajuns la ${targetPoi.name}!`);
                setSelectedPoi(targetPoi);
              }, 500);
            }
          }
        });

        if (tasksChanged) {
          setTasks(updatedTasks);
          syncQuestToDB(questStarted, updatedTasks); 
        }
      },
      (error) => console.warn("Eroare GPS", error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isClient, questStarted, tasks]);

  function handleStartQuest() {
    if ("geolocation" in navigator) {
      setQuestStarted(true);
      syncQuestToDB(true, tasks);
    }
  }

  function completeTask(taskId: string) {
    if (tasks[taskId] === undefined || tasks[taskId] === true) return;
    const next = { ...tasks, [taskId]: true };
    setTasks(next);
    syncQuestToDB(questStarted, next);
  }

  function handleSelectPoi(p: POI) {
    setSelectedPoi(p);
  }

  async function saveStory(s: UserStory) {
    try {
      const res = await fetch(`${API_URL}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s)
      });
      const savedStory = await res.json();
      setUserStories([savedStory, ...userStories]);
      setAddingLocation(null);
      completeTask("add_story");
    } catch (err) { alert("Eroare la conectarea cu baza de date!"); }
  }

  async function handleEditStory(updatedStory: UserStory) {
    try {
      await fetch(`${API_URL}/api/stories/${updatedStory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStory)
      });
      setUserStories(userStories.map(s => s.id === updatedStory.id ? updatedStory : s));
      setEditingStory(null);
      completeTask("edit_story");
    } catch (err) { alert("Eroare la actualizare!"); }
  }

  async function handleDeleteStory(id: string) {
    if (window.confirm("Ești sigur că vrei să ștergi această amintire definitiv?")) {
      try {
        await fetch(`${API_URL}/api/stories/${id}`, { method: "DELETE" });
        setUserStories(userStories.filter(s => s.id !== id));
      } catch (err) { alert("Eroare la ștergere!"); }
    }
  }

  return (
    <main className="min-h-screen relative pb-20">
      <header className="border-b border-border px-6 pb-6 pt-10 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-type text-xs uppercase tracking-[0.4em] text-sepia">Arhivă vie · Parcul Tineretului · Orășelul Copiilor</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-ink sm:text-7xl">Tineretului <span className="italic text-accent">de altădată</span></h1>
          <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-ink/80 sm:text-xl">O hartă desenată pe hârtie veche. Deschide Jurnalul și pornește la pas prin parc pentru a debloca istoria!</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:px-12 lg:grid-cols-[1fr_320px]">
        <div className="paper-card relative h-[520px] overflow-hidden sm:h-[640px]">
          {isClient ? (
            <Suspense fallback={<div>Se desfășoară harta…</div>}>
              <HeritageMap onSelect={handleSelectPoi} onSelectUserStory={setSelectedUserStory} onMapClick={(lat, lng) => setAddingLocation({ lat, lng })} userStories={userStories} userLocation={userLocation} />
            </Suspense>
          ) : (<div>Se pregătesc documentele...</div>)}
        </div>

        <aside className="paper-card p-6 flex flex-col h-[520px] sm:h-[640px]">
          <div><h2 className="font-display text-2xl font-bold text-ink">Puncte de interes</h2></div>
          <ol className="mt-5 space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {POIS.map((p, i) => (
              <li key={p.id}>
                <button onClick={() => handleSelectPoi(p)} className="group flex w-full items-start gap-3 rounded-sm border border-transparent p-2 text-left hover:bg-paper-dark/30">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">{i + 1}</span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink group-hover:text-accent">{p.name}</span>
                    <span className="font-type text-xs uppercase text-sepia">{p.year}</span>
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
                    {s.image && <img src={s.image} alt="" className="sepia-img mb-3 h-40 w-full object-cover" />}
                    <h3 className="font-display text-xl font-bold text-ink">{s.name}</h3>
                    <p className="mt-2 font-body text-ink/90">{s.story}</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-4 border-t border-sepia/30 pt-3">
                    <button onClick={() => setEditingStory(s)} className="text-accent hover:text-ink font-semibold text-sm">✎ Editează</button>
                    {isWithinFiveMinutes && <button onClick={() => handleDeleteStory(s.id)} className="text-red-700 hover:text-red-900 font-semibold text-sm">✕ Șterge</button>}
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

      <ExplorerJournal tasks={tasks} questStarted={questStarted} onStartQuest={handleStartQuest} userId={userId} />
    </main>
  );
}