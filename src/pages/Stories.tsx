import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../style/stories.css";

/* =====================
   TYPES
===================== */

type Story = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
};

type Comment = {
  id: string;
  body: string;
  created_at: string;
};

/* =====================
   PAGE /stories
===================== */

export default function Stories() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const openId = params.get("open");
  const token = localStorage.getItem("authToken");

  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  /* =====================
     LOAD STORIES
  ===================== */

  useEffect(() => {
    const url = tagFilter
      ? `http://localhost:8000/api/stories?tag=${tagFilter}`
      : "http://localhost:8000/api/stories";

    fetch(url)
      .then((r) => r.json())
      .then(setStories);
  }, [tagFilter]);

  /* =====================
     OPEN STORY
  ===================== */

  useEffect(() => {
    if (!openId) return;

    fetch(`http://localhost:8000/api/stories/${openId}`)
      .then((r) => r.json())
      .then(setActiveStory);
  }, [openId]);

  /* =====================
     LOAD COMMENTS
  ===================== */

  useEffect(() => {
    if (!activeStory) return;

    fetch(`http://localhost:8000/api/stories/${activeStory.id}/comments`)
      .then((r) => r.json())
      .then(setComments);
  }, [activeStory]);

  async function addComment() {
    if (!token || !activeStory) return;
    if (commentInput.trim().length < 2) return;

    const res = await fetch(
      `http://localhost:8000/api/stories/${activeStory.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: commentInput }),
      }
    );

    if (!res.ok) return;

    setCommentInput("");
    const updated = await res.json();
    setComments(updated);
  }

  function joinDiscussion(story: Story) {
    const tag = story.tags[0];
    if (tag) navigate(`/chat/${tag}`);
  }

  return (
    <div className="page stories-page">
      <button className="back-button-global" onClick={() => navigate("/")}>
        ←
      </button>

      <header className="page-header">
        <h1>Histoires des autres</h1>
        <p>Des récits humains, anonymes et réels.</p>
      </header>

      <section className="toolbar">
        <div className="filters">
          <button onClick={() => setTagFilter("")}>Tout</button>
          {["burnout", "solitude", "rupture", "expatriation", "changement"].map(
            (t) => (
              <button key={t} onClick={() => setTagFilter(t)}>
                {t}
              </button>
            )
          )}
        </div>

        <button className="btn primary" onClick={() => navigate("/story")}>
          Écrire mon histoire
        </button>
      </section>

      <div className="layout">
        <div className="list">
          {stories.map((s) => (
            <div
              key={s.id}
              className="story-tile"
              onClick={() => setActiveStory(s)}
            >
              <strong>{s.title}</strong>
              <div className="tile-tags">{s.tags.join(", ")}</div>
            </div>
          ))}
        </div>

        <div className="reader">
          {!activeStory ? (
            <p>Choisis une histoire.</p>
          ) : (
            <>
              <h2>{activeStory.title}</h2>
              <p>{activeStory.body}</p>

              <button onClick={() => joinDiscussion(activeStory)}>
                Rejoindre la discussion
              </button>

              <div className="comments">
                <h3>Commentaires</h3>

                {comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div>{c.body}</div>
                    <small>
                      {new Date(c.created_at).toLocaleString()}
                    </small>
                  </div>
                ))}

                {token && (
                  <>
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Message bienveillant…"
                    />
                    <button onClick={addComment}>Publier</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
