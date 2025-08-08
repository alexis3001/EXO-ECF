

"use client"
import { supabase } from "../Supabase/supabaseclient";
import { useState, useEffect } from "react";


export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setIsConnected(true);
      else setIsConnected(false);
    });
  }, []);
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
            <li><a href="/Prevision">prévisions météo 5j/7</a></li>
            {isConnected ? (
              <li><a href="/Profil">Profil</a></li>
            ) : (
              <li><a href="/Connexion">Connexion</a></li>
            )}
          </ul>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h1>Bienvenue sur <span className="green">météo.com</span></h1>
          <p>Consultez la météo de votre ville en un clic, suivez les actualités climatiques et préparez votre journée facilement.</p>
          <a href="index.html" className="btn">Voir la météo</a>
        </section>

        <section className="features">
          <div className="card">
            <h2>Prévisions locales</h2>
            <p>Températures, précipitations et vent dans votre ville.</p>
          </div>
          <div className="card">
            <h2>Actualités météo</h2>
            <p>Restez informé des événements climatiques importants.</p>
          </div>
          <div className="card">
            <h2>Design adapté</h2>
            <p>Navigation facile sur mobile et ordinateur.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>2025 - météo.com - Mentions légales</p>
      </footer>
    </>
  );
}
