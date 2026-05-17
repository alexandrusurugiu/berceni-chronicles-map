import { useState } from "react";

// Definim toate misiunile posibile în aplicație
export const TASK_POOL = [
  { id: "find_cocioc", icon: "🧭", title: "Originile parcului", desc: "Găsește pe hartă Mlaștina Cocioc." },
  { id: "read_facts", icon: "💡", title: "Cercetător de detaliu", desc: "Citește secțiunea 'Știai că...' a unui punct." },
  { id: "add_story", icon: "✒️", title: "Contribuie la arhivă", desc: "Adaugă propria ta poveste pe hartă." },
  { id: "edit_story", icon: "📝", title: "Revizie istorică", desc: "Editează o poveste adăugată de tine." },
  { id: "find_cenusa", icon: "🏛️", title: "Arhitectură misterioasă", desc: "Găsește monumentul istoric Crematoriul Cenușa." },
  { id: "find_pod", icon: "🌉", title: "Promenada pe lac", desc: "Vizitează virtual Podul Arcuit din Tineretului." }
];

// Acum tasks va fi un dicționar cu ID-ul taskului și starea lui (ex: { "find_cocioc": true, "add_story": false })
export default function ExplorerJournal({ tasks }: { tasks: Record<string, boolean> }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extragem doar ID-urile task-urilor active pentru acest utilizator
  const activeTaskIds = Object.keys(tasks);
  
  // Verificăm dacă există cel puțin un task neterminat (pentru bulina roșie)
  const hasPendingTasks = activeTaskIds.some(id => !tasks[id]);

  return (
    <div className="fixed bottom-6 right-6 z-[900] flex flex-col items-end">
      
      {isOpen && (
        <div className="paper-card deckle-edge mb-4 w-72 sm:w-80 p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-start border-b border-sepia/30 pb-2 mb-3">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Jurnal de Arhivă</h3>
              <p className="font-type text-xs uppercase text-sepia">Misiuni locale</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-sepia hover:text-accent font-bold">✕</button>
          </div>
          
          <ul className="space-y-4">
            {activeTaskIds.map(taskId => {
              // Căutăm detaliile task-ului în POOL-ul general
              const taskMeta = TASK_POOL.find(t => t.id === taskId);
              if (!taskMeta) return null;
              
              const isDone = tasks[taskId];

              return (
                <li key={taskId} className={`flex gap-3 items-start transition-opacity ${isDone ? 'opacity-60' : 'opacity-100'}`}>
                  <span className="text-xl mt-1">{isDone ? '✅' : taskMeta.icon}</span>
                  <div>
                    <p className={`font-display font-semibold ${isDone ? 'line-through text-sepia' : 'text-ink'}`}>{taskMeta.title}</p>
                    <p className="font-body text-sm text-ink/80">{taskMeta.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Butonul Plutitor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_0_15px_rgba(92,37,23,0.4)] border-2 border-paper transition-transform hover:scale-110 active:scale-95"
        title="Jurnal de Explorator"
      >
        <span className="text-3xl relative top-[2px]">📜</span>
        {hasPendingTasks && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d94824] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d94824] border border-paper"></span>
          </span>
        )}
      </button>
    </div>
  );
}