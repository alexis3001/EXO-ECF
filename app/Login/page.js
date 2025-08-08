"use client";
import { supabase } from "../../Supabase/supabaseclient";
import { useState } from "react";


export default function Conect() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Création du compte utilisateur
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // Insertion du profil dans la table "profiles" avec l'id utilisateur
    const userId = data?.user?.id;
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, email, nom }]);
    if (profileError) {
      setError(profileError.message);
      return;
    }
    // Insertion dans la table utilisateurs_premium (abonnement non actif par défaut)
    await supabase
      .from("utilisateurs_premium")
      .insert([
        {
          user_id: userId,
          date_debut: new Date().toISOString(),
          actif: false
        }
      ]);
    setSuccess("Inscription réussie !");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSuccess("");
    setError("");
    setEmail("");
    setPassword("");
    setNom("");
    setShowForm(false);
  };

  return (
    <main className="main-container">
      <h2>Inscription</h2>
      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)}>
          Inscrivez-vous
        </button>
      )}

      
      {showForm && (
        <form
          onSubmit={handleSignup}
          style={{
            maxWidth: 400,
            margin: "auto",
            transition: "opacity 0.5s",
            opacity: showForm ? 1 : 0,
          }}
        >
          <div>
            <label htmlFor="nom">Nom :</label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 10 }}
            />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 10 }}
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 10 }}
            />
          </div>
          <button type="submit" className="btn">S'inscrire</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button className="btn" style={{marginTop: 20}} onClick={() => window.location.href = "/"}>
            Retour au menu principal
          </button>
        </form>
      )}
      <button className="btn" style={{marginTop: 20}} onClick={handleLogout}>
        Se déconnecter
      </button>
    </main>
  );
}
