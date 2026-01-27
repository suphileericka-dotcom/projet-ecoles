// =====================
// IMPORTS
// =====================

// Hooks React
import { useEffect, useRef, useState } from "react";

// Navigation React Router
import { useNavigate } from "react-router-dom";

// Composants internes
import MicButton from "./MicButton";

// Styles
import "../index.css";
import "../style/changement.css";

// Socket.io
import { socket } from "../lib/socket";

/* =====================
   TYPES
===================== */

type Message = {
  id: string;
  type: "text" | "voice";
  text?: string;
  audioUrl?: string;
  createdAt: number;
  editedAt?: number;
};

type PinnedNote = {
  id: string;
  text: string;
  createdAt: number;
};

/* =====================
   CONSTANTES
===================== */

const ROOM = "changement";
const NOTE_KEY = "changement_note";
const EDIT_WINDOW = 20 * 60 * 1000;
const NOTE_DURATION = 24 * 60 * 60 * 1000;

/* =====================
   COMPONENT
===================== */

export default function Changement() {
  const navigate = useNavigate();

  /* =====================
     STATES
  ===================== */

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState<PinnedNote | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);

  /* =====================
     REFS & USER
  ===================== */

  const streamRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("userId");

  /* =====================
     SOCKET
  ===================== */

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("join-room", { room: ROOM, userId });

    socket.on("online-count", ({ room, count }) => {
      if (room === ROOM) setOnlineCount(count);
    });

    return () => {
      socket.emit("leave-room", { room: ROOM, userId });
      socket.off("online-count");
    };
  }, [userId]);

  /* =====================
     LOAD MESSAGES
  ===================== */

  useEffect(() => {
    fetch(`http://localhost:8000/api/messages?room=${ROOM}`)
      .then((r) => r.json())
      .then((data) =>
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            type: "text",
            text: m.content,
            createdAt: m.created_at,
          }))
        )
      );
  }, []);

  /* =====================
     LOAD NOTE (24H)
  ===================== */

  useEffect(() => {
    const saved = localStorage.getItem(NOTE_KEY);
    if (!saved) return;

    const parsed: PinnedNote = JSON.parse(saved);
    if (Date.now() - parsed.createdAt < NOTE_DURATION) {
      setNote(parsed);
    } else {
      localStorage.removeItem(NOTE_KEY);
    }
  }, []);

  /* =====================
     AUTOSCROLL
  ===================== */

  useEffect(() => {
    streamRef.current?.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* =====================
     HELPERS
  ===================== */

  function canEdit(m: Message) {
    return m.type === "text" && Date.now() - m.createdAt <= EDIT_WINDOW;
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* =====================
     SEND MESSAGE
  ===================== */

  async function handleSend() {
    if (!userId || !input.trim()) return;

    // édition locale
    if (editingId) {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === editingId
            ? { ...m, text: input, editedAt: Date.now() }
            : m
        )
      );
      setEditingId(null);
      setInput("");
      return;
    }

    const res = await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: ROOM,
        userId,
        content: input,
      }),
    });

    const saved = await res.json();

    setMessages((msgs) => [
      ...msgs,
      {
        id: saved.id,
        type: "text",
        text: saved.content,
        createdAt: saved.created_at,
      },
    ]);

    setInput("");
  }

  /* =====================
     AUDIO
  ===================== */

  function onVoiceRecorded(audioUrl: string) {
    if (!userId) return;

    setMessages((msgs) => [
      ...msgs,
      {
        id: `${Date.now()}-${Math.random()}`,
        type: "voice",
        audioUrl,
        createdAt: Date.now(),
      },
    ]);
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="chat-root changement">
      {/* RETOUR */}
      <button
        className="back-button-global changement"
        onClick={() => navigate("/")}
        aria-label="Retour à l'accueil"
      >
        ←
      </button>

      {/* HEADER */}
      <header className="chat-header">
        <h1>Changement de vie</h1>
        <div className="online">
          <span className="dot" /> {onlineCount} en ligne
        </div>
        <span className="sub">
          Un espace sûr pour traverser les transitions
        </span>
      </header>

      {/* MESSAGES */}
      <main className="chat-stream" ref={streamRef}>
        <div className="secure-banner">
          Vous êtes dans un espace anonyme et bienveillant.
        </div>

        {note && (
          <div className="pinned-note">
            <strong>Ma note (24h)</strong>
            <p>{note.text}</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="message-row">
            <div className="bubble-wrapper">
              {m.type === "text" && <div className="bubble">{m.text}</div>}
              {m.type === "voice" && <audio controls src={m.audioUrl} />}

              <div className="meta">
                <span>{formatTime(m.createdAt)}</span>
                {m.editedAt && <span> (modifié)</span>}
              </div>

              {canEdit(m) && (
                <div className="actions">
                  <button
                    onClick={() => {
                      setInput(m.text ?? "");
                      setEditingId(m.id);
                    }}
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="chat-footer">
        <MicButton onVoiceRecorded={onVoiceRecorded} />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            userId
              ? "Partagez ce que vous avez en tête…"
              : "Connectez-vous pour participer"
          }
          disabled={!userId}
        />

        <button onClick={handleSend} disabled={!userId}>
          {editingId ? "Modifier" : "Envoyer"}
        </button>
      </footer>
    </div>
  );
}
