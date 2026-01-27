// =====================
// PAGE INFO — VERSION ALIGNÉE AU STYLE EXISTANT
// =====================

import { useNavigate } from "react-router-dom";
import "../style/info.css";

export default function Info() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      {/* =====================
          HEADER
      ===================== */}
      <header className="info-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>À propos</h1>
      </header>

      {/* =====================
          HERO
      ===================== */}
      <section className="info-hero">
        <div className="info-icon">💬</div>
        <h2>Espace de soutien</h2>
        <p>
          Un lieu anonyme pour partager ce que vous traversez,
          sans jugement.
        </p>
      </section>

      {/* =====================
          MISSION
      ===================== */}
      <section className="info-card">
        <h3>🌱 Pourquoi cette application ?</h3>
        <p>
          Cette application a été créée pour offrir un espace
          simple, humain et respectueux aux personnes
          traversant des moments difficiles.
        </p>
        <p>
          Ici, vous pouvez parler, écrire, lire et échanger
          en toute anonymat, sans pression ni obligation.
        </p>
      </section>

      {/* =====================
          POUR QUI
      ===================== */}
      <section className="info-card">
        <h3>👤 À qui s’adresse cet espace</h3>
        <ul className="info-list">
          <li>Personnes en situation de burnout</li>
          <li>Personnes vivant une rupture</li>
          <li>Personnes confrontées à la solitude</li>
          <li>Personnes expatriées</li>
          <li>Personnes en période de changement de vie</li>
        </ul>
      </section>

      {/* =====================
          CE QUE L'APP PERMET
      ===================== */}
      <section className="info-card">
        <h3>🧩 Ce que vous pouvez faire ici</h3>
        <ul className="info-list">
          <li>Raconter votre histoire personnelle</li>
          <li>Échanger dans des espaces thématiques</li>
          <li>Lire et commenter les histoires des autres</li>
          <li>Découvrir des personnes vivant des expériences similaires</li>
          <li>Tenir un journal personnel guidé</li>
        </ul>
      </section>

      {/* =====================
          THÉMATIQUES
      ===================== */}
      <section className="info-card">
        <h3>🗂 Espaces disponibles</h3>
        <div className="themes-grid">
          <div>Burnout</div>
          <div>Solitude</div>
          <div>Rupture</div>
          <div>Expatriation</div>
          <div>Changement</div>
        </div>
      </section>

      {/* =====================
          LIMITES & RESPONSABILITÉ
      ===================== */}
      <section className="info-card">
        <h3>⚠️ Important à savoir</h3>
        <p>
          Cette application n’est pas un service médical
          et ne remplace pas un professionnel de santé.
        </p>
        <p>
          En cas de détresse grave ou de danger immédiat,
          il est essentiel de contacter un proche,
          un professionnel ou les services d’urgence.
        </p>
      </section>

      {/* =====================
          FOOTER
      ===================== */}
      <footer className="info-footer">
        <button onClick={() => navigate("/")}>
          Revenir à l’accueil
        </button>
        <p>
          Anonymat • Bienveillance • Respect
        </p>
      </footer>
    </div>
  );
}
