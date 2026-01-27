import "./index.css";
import "./style/app.css";

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* =====================
   PAGES PUBLIQUES
===================== */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Info from "./pages/Info";

/* =====================
   ESPACES DE DISCUSSION
===================== */

import Burnout from "./components/Burnout";
import Rupture from "./components/Rupture";
import Solitude from "./components/Solitude";
import Expatriation from "./components/Expatriation";
import Changement from "./components/Changement";

/* =====================
   PARCOURS PERSONNEL
===================== */

import MyStory from "./pages/MyStory";
import MySpace from "./pages/MySpace";
import Stories from "./pages/Stories";
import Match from "./pages/Match";
import AIJournal from "./pages/AIJournal";

/* =====================
   TYPES
===================== */

type User = {
  id: string;
  username: string;
  email: string;
  language: string;
  country: string;
  avatar_url?: string;
  dark_mode: boolean;
  show_chats: boolean;
};

/* =====================
   APP
===================== */

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem("authToken");

  /* =====================
     LOAD SESSION
     → vérifie si l'utilisateur est connecté
  ===================== */

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("authToken");
        setUser(null);
      });
  }, []);

  /* =====================
     DARK MODE
  ===================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      Boolean(user?.dark_mode)
    );
  }, [user?.dark_mode]);

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  }

  /* =====================
     HOME PUBLIQUE
     → visible uniquement si NON connecté
  ===================== */

  function PublicHome() {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Espace de soutien</h1>
          <button onClick={() => navigate("/info")}>ℹ️</button>
        </header>

        <section className="welcome">
          <p>Un espace anonyme pour partager ce que vous traversez</p>

          <div className="auth-buttons">
            <button onClick={() => navigate("/login")}>
              Se connecter
            </button>
            <button onClick={() => navigate("/register")}>
              Créer un compte
            </button>
          </div>
        </section>

        <div className="anonymity">
          👁️ Anonymat total • Respect • Bienveillance
        </div>
      </div>
    );
  }

  /* =====================
     HUB CONNECTÉ
     → page d’entrée APRÈS connexion
  ===================== */

  function ConnectedHome() {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Bienvenue {user?.username}</h1>
          <button onClick={logout}>Se déconnecter</button>
        </header>

        {/* 🔹 PARCOURS PERSONNEL */}
        <section className="spaces">
          <ChatCard
            title="Mon histoire"
            description="Raconter ce que tu traverses"
            variant="story"
            onClick={() => navigate("/story")}
          />

          <ChatCard
            title="Mon espace"
            description="Ton univers personnalisé"
            variant="personal"
            onClick={() => navigate("/my-space")}
          />

          <ChatCard
            title="Connexions humaines"
            description="Personnes qui vivent des choses proches"
            variant="match"
            onClick={() => navigate("/match")}
          />

          <ChatCard
            title="Journal guidé"
            description="Écrire en sécurité avec un cadre clair"
            variant="ai"
            onClick={() => navigate("/ai-journal")}
          />
        </section>

        {/* 🔹 ESPACES DE DISCUSSION */}
        <section className="spaces">
          <ChatCard
            title="Burnout"
            description="Fatigue, surcharge, perte de sens"
            variant="burnout"
            onClick={() => navigate("/chat/burnout")}
          />
          <ChatCard
            title="Solitude"
            description="Se sentir moins seul·e"
            variant="solitude"
            onClick={() => navigate("/chat/solitude")}
          />
          <ChatCard
            title="Rupture"
            description="Se reconstruire"
            variant="rupture"
            onClick={() => navigate("/chat/rupture")}
          />
          <ChatCard
            title="Expatriation"
            description="Vivre loin, s’adapter"
            variant="expatriation"
            onClick={() => navigate("/chat/expatriation")}
          />
          <ChatCard
            title="Changement"
            description="Transitions de vie"
            variant="changement"
            onClick={() => navigate("/chat/changement")}
          />
        </section>
      </div>
    );
  }

  /* =====================
     ROUTES
  ===================== */

  return (
    <Routes>
      {/* 🔹 HOME */}
      <Route
        path="/"
        element={user ? <ConnectedHome /> : <PublicHome />}
      />

      {/* 🔹 AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/info" element={<Info />} />

      {/* 🔹 PARCOURS PERSONNEL (PROTÉGÉ) */}
      <Route path="/story" element={user ? <MyStory /> : <Navigate to="/login" />} />
      <Route path="/my-space" element={user ? <MySpace /> : <Navigate to="/login" />} />
      <Route path="/stories" element={user ? <Stories /> : <Navigate to="/login" />} />
      <Route path="/match" element={user ? <Match /> : <Navigate to="/login" />} />
      <Route path="/ai-journal" element={user ? <AIJournal /> : <Navigate to="/login" />} />

      {/* 🔹 CHATS */}
      <Route path="/chat/burnout" element={<Burnout />} />
      <Route path="/chat/solitude" element={<Solitude />} />
      <Route path="/chat/expatriation" element={<Expatriation />} />
      <Route path="/chat/rupture" element={<Rupture />} />
      <Route path="/chat/changement" element={<Changement />} />
    </Routes>
  );
}

/* =====================
   CHAT CARD
===================== */

function ChatCard({
  title,
  description,
  variant,
  onClick,
}: {
  title: string;
  description: string;
  variant: string;
  onClick: () => void;
}) {
  return (
    <div className={`space-card space-${variant}`} onClick={onClick}>
      <div className="content">
        <h4>{title}</h4>
        <p>{description}</p>
        <span className="enter">Entrer →</span>
      </div>
    </div>
  );
}
