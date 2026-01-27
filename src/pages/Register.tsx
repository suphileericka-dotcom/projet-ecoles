import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/register.css";

/**
 * Page Register
 * Rôle :
 * - créer un compte utilisateur
 * - récupérer un token + userId depuis le backend
 * - rediriger vers l'accueil (hub connecté)
 */
export default function Register() {
  const navigate = useNavigate();

  /* =====================
     STATE FORMULAIRE
  ===================== */

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "FR",
    situation: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  /* =====================
     UPDATE INPUTS
  ===================== */

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  /* =====================
     SUBMIT FORM
  ===================== */

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Sécurité basique côté client
    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!form.terms) {
      alert("Vous devez accepter les conditions d’utilisation");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
            city: form.city,
            country: form.country,
            situation: form.situation,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur lors de l’inscription");
        return;
      }

      /* =====================
         SESSION
      ===================== */

      // Token JWT
      localStorage.setItem("authToken", data.token);

      // ID utilisateur (utilisé partout dans ton app)
      localStorage.setItem("userId", data.user.id);

      // Redirection vers l'accueil (hub connecté)
      navigate("/");
    } catch (err) {
      alert("Erreur réseau. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="auth-root">
      {/* Bouton retour */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ←
      </button>

      <h1>Créer un compte</h1>
      <p className="subtitle">
        Rejoignez la communauté de manière sécurisée et confidentielle
      </p>

      <form className="auth-form" onSubmit={submit}>
        <input
          name="username"
          placeholder="Nom d'utilisateur anonyme"
          value={form.username}
          onChange={update}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={update}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={update}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChange={update}
          required
        />

        <input
          name="city"
          placeholder="Ville"
          value={form.city}
          onChange={update}
        />

        <select name="country" value={form.country} onChange={update}>
          <option value="FR">France</option>
          <option value="BE">Belgique</option>
          <option value="CH">Suisse</option>
          <option value="CA">Canada</option>
          <option value="LU">Luxembourg</option>
          <option value="MC">Monaco</option>
          <option value="DZ">Algérie</option>
          <option value="MA">Maroc</option>
          <option value="TN">Tunisie</option>
        </select>

        <select
          name="situation"
          value={form.situation}
          onChange={update}
          required
        >
          <option value="">Situation actuelle</option>
          <option value="burnout">Burnout</option>
          <option value="rupture">Rupture</option>
          <option value="solitude">Solitude</option>
          <option value="expatriation">Expatriation</option>
          <option value="changement">Changement</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={update}
          />
          J’accepte les conditions d’utilisation
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="auth-footer">
        Vous avez déjà un compte ?{" "}
        <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
