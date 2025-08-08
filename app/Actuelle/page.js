"use client";

import { supabase } from "../../Supabase/supabaseclient";
import { useState, useEffect } from "react";

const API_KEY = "ae7bfea9e7084636c48ff46874a3b28e";

function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export default function Actuelle() {
  const [ville, setVille] = useState("Paris");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [favError, setFavError] = useState("");
  const [favSuccess, setFavSuccess] = useState("");

  useEffect(() => {
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
    // Récupère l'utilisateur connecté
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      else setUser(null);
    });
  }, [ville]);

  // Extraction des infos météo
  let now, matin, apresmidi, soir, nuit;
  if (data) {
    now = data.list[0];
    const getPeriod = (hour) => data.list.find(item => item.dt_txt.includes(`${hour}:00:00`));
    matin = getPeriod("06");
    apresmidi = getPeriod("12");
    soir = getPeriod("18");
    nuit = getPeriod("00");
  }


  // const handleAddFavori = async () => {
  //   if (!user) {
  //     setFavError("Vous devez être connecté pour ajouter un favori.");
  //     return;
  //   }
  //   if (data && data.city) {
  //     const { error } = await supabase
  //       .from("favoris")
  //       .insert({ user_id: user.id, ville: data.city.name });
  //     if (error) {
  //       setFavError(error.message);
  //     } else {
  //       setFavSuccess("Ville ajoutée aux favoris !");
  //       setFavError("");
  //     }
  //   } else {
  //     setFavError("Aucune donnée météo disponible.");
  //   }

  // };



  const handleAddFavori = async () => {
  setFavError("");
  setFavSuccess("");

  if (!user) {
    setFavError("Vous devez être connecté pour ajouter un favori.");
    return;
  }

  // Étape 1 : Vérifier si l'utilisateur est premium
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("premium")
    .eq("id", user.id)
    .single();

  if (profileError) {
    setFavError("Erreur lors de la vérification du profil.");
    return;
  }

  const isPremium = profile?.premium === true;
  const maxFavoris = isPremium ? 100 : 3; // Tu peux adapter cette limite

  // Étape 2 : Compter les favoris actuels
  const { data: favoris, error: favCountError } = await supabase
    .from("favoris")
    .select("id", { count: "exact", head: false }) // récupère tous les IDs
    .eq("user_id", user.id);

  if (favCountError) {
    setFavError("Erreur lors de la récupération de vos favoris.");
    return;
  }

  if (favoris.length >= maxFavoris) {
    setFavError(
      `Vous avez atteint la limite de favoris autorisés (${maxFavoris}).`
    );
    return;
  }

  // Étape 3 : Ajouter le favori
  const { error: insertError } = await supabase
    .from("favoris")
    .insert([{ user_id: user.id, ville: ville }]);

  if (insertError) {
    setFavError(insertError.message);
  } else {
    setFavSuccess(`La ville ${ville} a été ajoutée à vos favoris !`);
  }
};


  return (
    <>
      <header>
        <div className="logo">🌤️ <span>météo</span><span className="green">.com</span></div>
        <div className="autocomplete-container">
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
          <button className="btn" style={{marginLeft: 10}} onClick={handleAddFavori}>
            Ajouter aux favoris
          </button>
        </div>
        {favError && <p style={{color: "red"}}>{favError}</p>}
        {favSuccess && <p style={{color: "green"}}>{favSuccess}</p>}
        <nav>
          <button className="menu-toggle" id="menu-toggle" onClick={() => {
            const menu = document.getElementById('menu');
            if (menu) menu.classList.toggle('open');
          }}>
            &#9776;
          </button>
          <ul id="menu">
            <li><a href="/">accueil</a></li>
            <li><a href="/Prevision">prévisions météo 5j/7</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-container">
        <h2>météo actuelle : <span>{data ? data.city.name : "chargement..."}</span></h2>
        {error && <p style={{color: "red"}}>{error}</p>}
        {now && (
          <div className="météo-box2">
            <div className="météo-info">
              <p><strong>{now.weather[0].description}</strong></p>
              <img src={getIconUrl(now.weather[0].icon)} alt={now.weather[0].description} />
            </div>
            <div className="météo-temp">
              <p><strong>{Math.round(now.main.temp_min)}°C</strong></p>
            </div>
          </div>
        )}
        <br /><br />

        <div className="detail-meteo">
          <h2>détail de la météo d'aujourd'hui:</h2>
          <div className="carte-meteo" >
            <div className="ligne">
              <div className="colonne">matin:</div>
              <div className="colonne icone">{matin && <img src={getIconUrl(matin.weather[0].icon)} alt={matin.weather[0].description} />}</div>
              <div className="colonne"><strong>{matin ? Math.round(matin.main.temp) + "°C" : "--°C"}</strong></div>
            </div>
            <hr />
            <div className="ligne">
              <div className="colonne"><strong>après-midi:</strong></div>
              <div className="colonne icone">{apresmidi && <img src={getIconUrl(apresmidi.weather[0].icon)} alt={apresmidi.weather[0].description} />}</div>
              <div className="colonne"><strong>{apresmidi ? Math.round(apresmidi.main.temp) + "°C" : "--°C"}</strong></div>
            </div>
            <hr />
            <div className="ligne">
              <div className="colonne"><strong>soir:</strong></div>
              <div className="colonne icone">{soir && <img src={getIconUrl(soir.weather[0].icon)} alt={soir.weather[0].description} />}</div>
              <div className="colonne"><strong>{soir ? Math.round(soir.main.temp) + "°C" : "--°C"}</strong></div>
            </div>
            <hr />
            <div className="ligne">
              <div className="colonne"><strong>nuit:</strong></div>
              <div className="colonne icone">{nuit && <img src={getIconUrl(nuit.weather[0].icon)} alt={nuit.weather[0].description} />}</div>
              <div className="colonne"><strong>{nuit ? Math.round(nuit.main.temp) + "°C" : "--°C"}</strong></div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>2025 - météo.com - mention légales</p>
      </footer>
    </>
  );}
