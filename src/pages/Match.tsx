// =====================
// PAGE MATCH — LIENS HUMAINS (RÉEL)
// =====================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/match.css";

type MatchProfile = {
  id: string;
  summary: string;
  common_tags: string[];
};

export default function Match() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const token = localStorage.getItem("authToken");

  /* =====================
     LOAD MATCHES (API RÉELLE)
  ===================== */
  useEffect(() => {
    fetch("http://localhost:8000/api/match", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setMatches)
      .catch(() => setMatches([]));
  }, []);

  return (
    <div className="match-root">
      <header className="match-header">
        <h1>Connexions humaines</h1>
        <p>
          Ces personnes traversent des expériences proches des tiennes.
          <br />
          Tu restes libre de choisir.
        </p>
      </header>

      <main className="match-list">
        {matches.length === 0 && (
          <p className="empty">
            Aucun profil similaire pour l’instant.
          </p>
        )}

        {matches.map((m) => (
          <div key={m.id} className="match-card">
            <p className="summary">“{m.summary}”</p>

            <div className="tags">
              {m.common_tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <div className="actions">
              <button onClick={() => navigate(`/stories/${m.id}`)}>
                Lire l’histoire
              </button>
              <button
                className="ghost"
                onClick={() => navigate(`/chat/${m.common_tags[0]}`)}
              >
                Discussion liée
              </button>
              <button className="ghost danger">Ignorer</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
