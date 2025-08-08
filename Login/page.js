
"use client";
import  supabase  from "../Supabase/supabaseclient";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


export default function Conect() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const inactivityTimer = useRef(null);

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
    // Insertion du profil dans la table "profiles"
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ email, nom }]);
    if (profileError) {
      setError(profileError.message);
      return;
    }
    setSuccess("Inscription réussie !");
    setTimeout(() => {
      router.push("/");
    }, 1000); // Redirection après 1s
  };

  // Déconnexion automatique après 10 min d'inactivité
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/Connexion");
      }, 10 * 60 * 1000); // 10 minutes
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

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
        </form>
      )}
    </main>
  );
}
