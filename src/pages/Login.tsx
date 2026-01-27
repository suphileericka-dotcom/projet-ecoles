import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

import { login } from "../services/auth";

/**
 * Page Login
 * Rôle :
 * - authentifier l’utilisateur
 * - récupérer token + userId depuis le backend
 * - stocker la session
 * - rediriger vers l’accueil connecté
 */
export default function Login() {
  const navigate = useNavigate();

  /* =====================
     STATES
  ===================== */

  const [identifier, setIdentifier] = useState(""); // email OU username
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorIdentifier, setErrorIdentifier] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  /* =====================
     LOGIN HANDLER
  ===================== */

  async function handleLogin() {
    // reset erreurs
    setErrorIdentifier(null);
    setErrorPassword(null);
    setErrorGlobal(null);

    // validations simples
    if (!identifier) {
      setErrorIdentifier("Email ou nom d'utilisateur requis");
      return;
    }

    if (!password) {
      setErrorPassword("Mot de passe requis");
      return;
    }

    try {
      setLoading(true);

      /**
       * 🔐 APPEL BACKEND VIA SERVICE
       * (plus de fetch direct ici)
       */
      const data = await login(identifier, password);

      /* =====================
         SESSION
      ===================== */

      // JWT
      localStorage.setItem("authToken", data.token);

      // ID utilisateur (clé centrale de ton app)
      localStorage.setItem("userId", data.user.id);

      if (remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // redirection vers l’accueil connecté
      navigate("/");
    } catch (err: any) {
      setErrorGlobal(
        err?.message || "Identifiants incorrects ou serveur indisponible"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="login-page">
      <div className="login-container">
        {/* HEADER */}
        <div className="login-header">
          <button onClick={() => navigate(-1)}>←</button>
          <h1>Connexion</h1>
        </div>

        {/* ILLUSTRATION */}
        <div className="login-illustration">
          <span className="material-symbols-outlined">
            lock
          </span>
        </div>

        <h2 className="login-title">Bienvenue</h2>
        <p className="login-subtitle">
          Connectez-vous pour accéder à la communauté.
        </p>

        {errorGlobal && (
          <div className="login-error global">{errorGlobal}</div>
        )}

        <div className="login-form">
          <div className="login-field">
            <label>Email ou nom d'utilisateur</label>
            <input
              className="login-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
            />
            {errorIdentifier && (
              <div className="login-error">{errorIdentifier}</div>
            )}
          </div>

          <div className="login-field">
            <label>Mot de passe</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errorPassword && (
              <div className="login-error">{errorPassword}</div>
            )}
          </div>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />{" "}
              Se souvenir de moi
            </label>

            {/* future feature */}
            <button type="button" disabled>
              Mot de passe oublié ?
            </button>
          </div>

          <button
            className="login-button"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>

        <div className="login-footer">
          Pas encore de compte ?{" "}
          <button onClick={() => navigate("/register")}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
