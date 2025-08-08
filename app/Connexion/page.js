"use client";
import { supabase } from "../../Supabase/supabaseclient";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const inactivityTimer = useRef(null);
  
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Connexion réussie !");
      setIsConnected(true);
      setTimeout(() => {
        router.push("/");
      }, 1000); // Redirection après 1s
    }
  };

  // Déconnexion automatique après 10 min d'inactivité
  useEffect(() => {
    // Vérifie la session au chargement
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setIsConnected(true);
    });
    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(async () => {
        await supabase.auth.signOut();
        setIsConnected(false);
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
      <h2>Connexion</h2>
      {!isConnected ? (
        <form onSubmit={handleLogin} style={{maxWidth: 400, margin: "auto"}}>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{width: "100%", marginBottom: 10}}
              
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
              style={{width: "100%", marginBottom: 10}}
            />
          </div>
          <button type="submit" className="btn">Se connecter</button>
          {error && <p style={{color: "red"}}>{error}</p>}
          {success && <p style={{color: "green"}}>{success}</p>}
        </form>
      ) : (
        <div style={{textAlign: "center", marginTop: 40}}>
          <Link href="/Profil">
            <button className="btn">Profil</button>
          </Link>
        </div>
      )}
      <div>
        <p>Pas encore de compte ? <Link href="/Login">Inscrivez-vous ici</Link></p>
      </div>

    </main>
  );
}
