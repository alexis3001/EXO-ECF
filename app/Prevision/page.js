"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../Supabase/supabaseclient";

const API_KEY = "ae7bfea9e7084636c48ff46874a3b28e";

function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

import Link from "next/link";
function PopupConnexion({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{background: "white", padding: 30, borderRadius: 10, textAlign: "center"}}>
        <h3>Connexion requise</h3>
        <p>Vous devez être connecté pour voir les prévisions météo.</p>
        <div style={{display: "flex", gap: 10, justifyContent: "center", marginTop: 20}}>
          <a href="/Connexion" className="btn">Se connecter</a>
          <Link href="/" className="btn">Retour accueil</Link>
        </div>
      </div>
    </div>
  );
}

export default function Previsions() {
  const [ville, setVille] = useState("Paris");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsConnected(!!session);
      setLoading(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== "200") {
          setError("Ville non trouvée !");
          setData(null);
        } else {
          setError("");
          setData(data);
        }
      })
      .catch(() => setError("Erreur météo !"));
  }, [ville, isConnected]);

  // Extraction des prévisions par jour
  let previsions = [];
  if (data) {
    // On prend le premier item de chaque jour (toutes les 24h)
    const jours = [];
    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!jours.includes(date)) {
        jours.push(date);
        previsions.push(item);
      }
    });
    previsions = previsions.slice(0, 5); // 5 jours
  }

  if (!isConnected && !loading) {
    return <PopupConnexion visible={true} />;
  }

  return (
    <>
      <header>
        <div className="logo">🌤️ <span>météo</span><span className="green">.com</span></div>
        <nav>
          <button className="menu-toggle" id="menu-toggle" onClick={() => {
            const menu = document.getElementById('menu');
            if (menu) menu.classList.toggle('open');
          }}>
            &#9776;
          </button>
          <ul id="menu">
            <li><a href="/Actuelle">Météo actuelle</a></li>
            <li><a href="/">accueil</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-container">
        <h2>Prévisions pour les 5 prochains jours</h2>
        <input
          type="text"
          value={ville}
          onChange={e => setVille(e.target.value)}
          placeholder="Entrez une ville"
          onKeyPress={e => {
            if (e.key === "Enter" && ville.trim() !== "") {
              setVille(ville.trim());
            }
          }}
        />
        {error && <p style={{color: "red"}}>{error}</p>}
        <div className="previsions">
          {previsions.length > 0 ? (
            previsions.map((prev, idx) => (
              <div key={idx} className="prevision-card">
                <h3>{new Date(prev.dt_txt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</h3>
                <img src={getIconUrl(prev.weather[0].icon)} alt={prev.weather[0].description} />
                <p>{prev.weather[0].description}</p>
                <p>Température : {Math.round(prev.main.temp)}°C</p>
                <p>Min : {Math.round(prev.main.temp_min)}°C / Max : {Math.round(prev.main.temp_max)}°C</p>
              </div>
            ))
          ) : (
            <p>Aucune prévision disponible...</p>
          )}
        </div>
      </main>

      <footer>
        <p>2025 - météo.com - Mentions légales</p>
      </footer>
    </>
  );
}