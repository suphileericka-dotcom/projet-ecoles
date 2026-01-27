// =====================
// JOURNAL GUIDÉ — RÉEL & RESPONSABLE
// =====================
//
// Rôle :
// - permettre à l’utilisateur d’écrire
// - proposer des questions guidées
// - sauvegarder côté backend
// - NE PAS faire de diagnostic
// - NE PAS pousser à l’action
// - rappeler les ressources humaines si besoin
//

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/journal.css";

/* =====================
   TYPES
===================== */

type JournalEntry = {
  id: string;
  text: string;
  created_at: number;
};

/* =====================
   QUESTIONS GUIDÉES
   (ne changent pas dynamiquement → sécurité)
===================== */

const QUESTIONS = [
  "Aujourd’hui, qu’est-ce qui t’a le plus pesé ?",
  "À quel moment t’es-tu senti le plus en difficulté ?",
  "Y a-t-il quelque chose qui t’a apporté un peu de soulagement ?",
  "Te sens-tu en sécurité en ce moment ?",
];

export default function AIJournal() {
  const navigate = useNavigate();

  /* =====================
     STATE
  ===================== */

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("authToken");

  /* =====================
     PROTECTION
  ===================== */

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* =====================
     LOAD JOURNAL ENTRIES
  ===================== */

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/journal", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger le journal");
        return r.json();
      })
      .then(setEntries)
      .catch(() => {
        setError("Erreur lors du chargement du journal");
      });
  }, [token]);

  /* =====================
     SAVE ENTRY
  ===================== */

  async function saveEntry() {
    setError(null);

    if (!input.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error("Impossible d’enregistrer");
      }

      const saved: JournalEntry = await res.json();

      setEntries((prev) => [...prev, saved]);
      setInput("");

      // on avance doucement dans les questions
      setQuestionIndex((i) =>
        Math.min(i + 1, QUESTIONS.length - 1)
      );
    } catch {
      setError("Une erreur est survenue. Réessaie plus tard.");
    }
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="ai-root">
      <header className="ai-header">
        <h1>Journal personnel</h1>
        <p>
          Cet espace est privé et sécurisé.
          <br />
          Il ne remplace pas un professionnel de santé.
        </p>
      </header>

      <main className="ai-stream">
        {entries.length === 0 && (
          <div className="ai-empty">
            Tu n’as encore rien écrit ici.
          </div>
        )}

        {entries.map((e) => (
          <div key={e.id} className="entry user">
            {e.text}
          </div>
        ))}
      </main>

      <footer className="ai-footer">
        <p className="question">
          {QUESTIONS[questionIndex]}
        </p>

        {error && (
          <div className="ai-error">{error}</div>
        )}

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris librement, sans pression…"
        />

        <button onClick={saveEntry}>
          Enregistrer
        </button>

        <p className="warning">
          ⚠️ Si tu te sens en danger immédiat,
          contacte un proche ou un professionnel.
        </p>
      </footer>
    </div>
  );
}
