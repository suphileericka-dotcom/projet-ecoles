import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/myStory.css";

/* =====================
   CONSTANTES
===================== */

const TAGS = [
  "burnout",
  "solitude",
  "rupture",
  "expatriation",
  "changement",
] as const;

type Tag = (typeof TAGS)[number];

type Story = {
  id: string;
  title: string;
  body: string;
  tags: Tag[];
  shared: boolean;
};

/* =====================
   PAGE /story
===================== */

export default function MyStory() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sharePublicly, setSharePublicly] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD EXISTING STORY
  ===================== */

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/story/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((story: Story | null) => {
        if (!story) return;
        setTitle(story.title);
        setBody(story.body);
        setSelectedTags(story.tags);
        setSharePublicly(story.shared);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }

  async function save() {
    if (!token) return;

    if (body.trim().length < 30) {
      alert("Écris encore un peu pour pouvoir enregistrer.");
      return;
    }

    const res = await fetch("http://localhost:8000/api/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title.trim() || "Mon histoire",
        body: body.trim(),
        tags: selectedTags,
        shared: sharePublicly,
      }),
    });

    if (!res.ok) {
      alert("Erreur lors de l’enregistrement.");
      return;
    }

    navigate("/my-space");
  }

  if (loading) {
    return <div className="page story-page">Chargement…</div>;
  }

  return (
    <div className="page story-page">
      <button className="back-button-global" onClick={() => navigate("/")}>
        ←
      </button>

      <header className="page-header">
        <h1>Ton histoire</h1>
        <p>Sans pression. Tu peux modifier à tout moment.</p>
      </header>

      <section className="card">
        <label className="label">Titre (optionnel)</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />

        <label className="label">Ton vécu</label>
        <textarea
          className="textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="tags">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag ${selectedTags.includes(tag) ? "on" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="row checkbox">
          <input
            id="share"
            type="checkbox"
            checked={sharePublicly}
            onChange={(e) => setSharePublicly(e.target.checked)}
          />
          <label htmlFor="share">
            Partager anonymement mon histoire
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={save}>
            Enregistrer
          </button>
        </div>
      </section>
    </div>
  );
}
