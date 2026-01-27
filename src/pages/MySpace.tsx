import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/mySpace.css";

/* =====================
   TYPES RÉELS
===================== */

type Story = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

type MatchProfile = {
  story_id: string;
  title: string;
  common_tags: string[];
};

type Recommendation = {
  tag: string;
  reason: string;
};

/* =====================
   PAGE /my-space
===================== */

export default function MySpace() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [myStory, setMyStory] = useState<Story | null>(null);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD DATA (REAL)
  ===================== */

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const [storyRes, matchRes, recoRes] = await Promise.all([
          fetch("http://localhost:8000/api/story/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/match", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/recommendations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (storyRes.ok) setMyStory(await storyRes.json());
        if (matchRes.ok) setMatches(await matchRes.json());
        if (recoRes.ok) setRecommendations(await recoRes.json());
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) {
    return <div className="page myspace-page">Chargement…</div>;
  }

  return (
    <div className="page myspace-page">
      <button className="back-button-global" onClick={() => navigate("/")}>
        ←
      </button>

      <header className="page-header">
        <h1>Mon espace</h1>
        <p>Un espace construit à partir de ce que tu as partagé.</p>
      </header>

      {/* =====================
          TON VÉCU
      ===================== */}
      <section className="block">
        <h2>🧠 Ton vécu</h2>

        {!myStory ? (
          <div className="empty">
            <p>Tu n’as pas encore écrit ton histoire.</p>
            <button className="btn primary" onClick={() => navigate("/story")}>
              Écrire mon histoire
            </button>
          </div>
        ) : (
          <div className="story-card">
            <h3>{myStory.title}</h3>
            <p>{myStory.body}</p>
            <div className="tags">
              {myStory.tags.map((t) => (
                <span key={t} className="tag on">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =====================
          PERSONNES SIMILAIRES
      ===================== */}
      <section className="block">
        <h2>🔗 Personnes similaires</h2>

        {matches.length === 0 ? (
          <p className="muted">
            Aucune correspondance pour le moment.
          </p>
        ) : (
          <div className="grid">
            {matches.map((m) => (
              <div key={m.story_id} className="mini-card">
                <strong>{m.title}</strong>
                <p>Points communs : {m.common_tags.join(", ")}</p>
                <button
                  className="btn tiny"
                  onClick={() =>
                    navigate(`/stories?open=${m.story_id}`)
                  }
                >
                  Lire
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================
          DISCUSSIONS
      ===================== */}
      <section className="block">
        <h2>💬 Discussions recommandées</h2>

        <div className="grid">
          {recommendations.map((r) => (
            <div key={r.tag} className="mini-card">
              <strong>{r.tag}</strong>
              <p>{r.reason}</p>
              <button
                className="btn tiny"
                onClick={() => navigate(`/chat/${r.tag}`)}
              >
                Entrer
              </button>
            </div>
          ))}
        </div>

        <div className="ai-cta">
          <strong>🤖 Journal guidé</strong>
          <p>Un espace personnel, sécurisé, sans jugement.</p>
          <button
            className="btn primary"
            onClick={() => navigate("/ai-journal")}
          >
            Ouvrir
          </button>
        </div>
      </section>
    </div>
  );
}
