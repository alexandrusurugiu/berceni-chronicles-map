import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export const TASK_POOL = [
  { id: "find_cocioc", icon: "🧭", title: "Originile parcului", desc: "Mergi până la locația fostei Bălții Cocioc." },
  { id: "find_cenusa", icon: "🏛️", title: "Arhitectură misterioasă", desc: "Mergi la Crematoriul Cenușa." },
  { id: "find_trenulet", icon: "🚂", title: "Nostalgia copilăriei", desc: "Mergi la Gara Trenulețului din Orășel." },
  { id: "find_pod", icon: "🌉", title: "Promenada pe lac", desc: "Mergi pe Podul Arcuit din Tineretului." },
  { id: "find_palat", icon: "🔭", title: "Căminul talentelor", desc: "Mergi până la intrarea în Palatul Național al Copiilor." },
  { id: "find_debarcader", icon: "🛶", title: "O plimbare pe lac", desc: "Mergi la vechiul debarcader din Tineretului." },
  { id: "find_eroi", icon: "🕯️", title: "Respect pentru istorie", desc: "Vizitează Cimitirul Eroilor Revoluției." },
  { id: "read_facts", icon: "💡", title: "Cercetător de detaliu", desc: "Citește secțiunea 'Știai că...' a unui punct." },
  { id: "add_story", icon: "✒️", title: "Contribuie la arhivă", desc: "Adaugă propria ta poveste pe hartă." },
  { id: "read_user_story", icon: "👥", title: "Conexiune locală", desc: "Citește o amintire adăugată de un alt vizitator." },
  { id: "add_image_story", icon: "📸", title: "Fotoreporter de epocă", desc: "Atașează o fotografie la o poveste adăugată de tine." },
  { id: "long_story", icon: "📜", title: "Romancierul parcului", desc: "Scrie o poveste detaliată, de peste 150 de caractere." },
  { id: "edit_story", icon: "📝", title: "Arhivar meticulos", desc: "Revizuiește și editează o amintire pe care ai scris-o anterior." },
  { id: "night_owl", icon: "🦉", title: "Explorator nocturn", desc: "Descoperă o poveste de pe hartă după lăsarea serii (după ora 20:00)." },
  { id: "read_three_pois", icon: "📚", title: "Sete de cunoaștere", desc: "Citește istoria a 3 puncte de interes diferite de pe hartă." },
  { id: "early_bird", icon: "🌅", title: "Roua dimineții", desc: "Deschide harta și pornește o misiune înainte de ora 10:00 dimineața." }
];

const UX_GRADES = [
  { id: "A", label: "A", desc: "Fără efort" },
  { id: "B", label: "B", desc: "Așteptări atinse" },
  { id: "C", label: "C", desc: "A necesitat efort" },
  { id: "D", label: "D", desc: "Frustrant" },
  { id: "F", label: "F", desc: "Inutilizabil" }
];

type Props = {
  tasks: Record<string, boolean>;
  questStarted: boolean;
  onStartQuest: () => void;
  userId: string;
};

export default function ExplorerJournal({ tasks, questStarted, onStartQuest, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState("");

  const activeTaskIds = Object.keys(tasks);
  const hasPendingTasks = activeTaskIds.some(id => !tasks[id]);
  const allTasksCompleted = activeTaskIds.length > 0 && !hasPendingTasks;

  useEffect(() => {
    if (localStorage.getItem("berceni-quest-feedback")) {
      setFeedbackGiven(true);
    }
  }, []);

  function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGrade) return;

    fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        grade: selectedGrade,
        suggestion: suggestion
      })
    })
    .then(() => {
      localStorage.setItem("berceni-quest-feedback", "true");
      setFeedbackGiven(true);
    })
    .catch(() => alert("Eroare la trimiterea feedback-ului!"));
  }

  return (
    <div className="fixed bottom-6 right-6 z-[900] flex flex-col items-end">
      
      {isOpen && (
        <div className="paper-card deckle-edge mb-4 w-80 sm:w-96 p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start border-b border-sepia/30 pb-2 mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Jurnal de Arhivă</h3>
              <p className="font-type text-xs uppercase text-sepia">Misiuni locale</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-sepia hover:text-accent font-bold text-xl">✕</button>
          </div>
          
          {!questStarted ? (
            <div className="py-6 text-center">
              <span className="text-5xl block mb-4">🗺️</span>
              <h4 className="font-display font-bold text-ink mb-2">Expediția te așteaptă!</h4>
              <p className="font-body text-sm text-ink/80 mb-6">Aplicația îți va cere acces la locație pentru a te ghida interactiv prin parc.</p>
              <button 
                onClick={onStartQuest}
                className="w-full rounded-sm bg-accent px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-md hover:bg-accent/90 transition-colors"
              >
                Începe Expediția
              </button>
            </div>
          ) : (
            <>
              {/* Lista de Task-uri */}
              <ul className="space-y-4 mb-6">
                {activeTaskIds.map(taskId => {
                  const taskMeta = TASK_POOL.find(t => t.id === taskId);
                  if (!taskMeta) return null;
                  const isDone = tasks[taskId];

                  return (
                    <li key={taskId} className={`flex gap-3 items-start transition-opacity ${isDone ? 'opacity-50' : 'opacity-100'}`}>
                      <span className="text-xl mt-1">{isDone ? '✅' : taskMeta.icon}</span>
                      <div>
                        <p className={`font-display font-semibold ${isDone ? 'line-through text-sepia' : 'text-ink'}`}>{taskMeta.title}</p>
                        <p className="font-body text-sm text-ink/80">{taskMeta.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* UX Scorecard Feedback Form (Apare doar când toate taskurile sunt gata) */}
              {allTasksCompleted && !feedbackGiven && (
                <div className="mt-6 pt-6 border-t border-sepia/30 animate-in fade-in">
                  <h4 className="font-display text-lg font-bold text-ink text-center mb-1">Ai finalizat expediția! 🎉</h4>
                  <p className="font-body text-xs text-center text-ink/70 mb-4">Evaluează experiența folosind grila UX Scorecard.</p>
                  
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    {/* Grila de note A-F */}
                    <div className="flex justify-between gap-1">
                      {UX_GRADES.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGrade(g.id)}
                          title={g.desc}
                          className={`flex flex-col items-center justify-center w-12 h-12 rounded-sm border-2 transition-all ${
                            selectedGrade === g.id 
                              ? 'border-accent bg-accent text-accent-foreground scale-110 shadow-md' 
                              : 'border-border bg-paper-dark/30 text-ink/70 hover:border-accent/50'
                          }`}
                        >
                          <span className="font-display font-bold text-lg leading-none">{g.label}</span>
                        </button>
                      ))}
                    </div>
                    {selectedGrade && (
                      <p className="text-center font-type text-xs font-bold text-accent uppercase tracking-wider">
                        {UX_GRADES.find(g => g.id === selectedGrade)?.desc}
                      </p>
                    )}

                    {/* Sugestii de misiuni */}
                    <label className="block mt-4">
                      <span className="font-display text-sm font-semibold text-ink">Ce locație ai vrea să adăugăm ca misiune?</span>
                      <textarea
                        rows={2}
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Ex: Fostul restaurant de pe insulă..."
                        className="mt-2 w-full rounded-sm border border-border bg-paper-dark/30 px-3 py-2 font-body text-sm text-ink placeholder:text-sepia/50 focus:border-accent focus:outline-none"
                      />
                    </label>

                    <button 
                      type="submit"
                      disabled={!selectedGrade}
                      className="w-full rounded-sm bg-ink px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-paper shadow-md hover:bg-ink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trimite Feedback
                    </button>
                  </form>
                </div>
              )}

              {/* Mesaj de mulțumire post-feedback */}
              {allTasksCompleted && feedbackGiven && (
                <div className="mt-6 pt-6 border-t border-sepia/30 text-center animate-in fade-in">
                  <span className="text-3xl mb-2 block">💌</span>
                  <p className="font-body text-sm text-ink/90 italic">
                    Mulțumim pentru feedback! Datele tale ajută la calibrarea experienței arhivelor vii.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Butonul Plutitor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_0_15px_rgba(92,37,23,0.4)] border-2 border-paper transition-transform hover:scale-110 active:scale-95"
        title="Jurnal de Explorator"
      >
        <span className="text-3xl relative top-[2px]">📜</span>
        {hasPendingTasks && questStarted && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d94824] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d94824] border border-paper"></span>
          </span>
        )}
      </button>
    </div>
  );
}