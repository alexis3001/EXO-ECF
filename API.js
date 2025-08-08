
  const API_KEY = "ae7bfea9e7084636c48ff46874a3b28e";
  const ville = ""; // Tu peux le rendre dynamique plus tard
  const input = document.getElementById("ville");
  


  // Fonction pour convertir les icônes OpenWeather en lien icons8 ou autre si tu veux
  function getIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  
  document.addEventListener("DOMContentLoaded", () => {
  afficherMeteo("Paris"); // Ou une ville par défaut

  const input = document.getElementById("ville");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const ville = e.target.value.trim();
        if (ville !== "") {
          afficherMeteo(ville);
        }
      }
    });
  } else {
    console.error("Le champ de recherche n'a pas été trouvé !");
  }
});

function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function afficherMeteo(ville) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== "200") {
        alert("Ville non trouvée !");
        return;
      }

      const now = data.list[0];

      document.getElementById("ville-affichee").textContent = data.city.name;
      document.getElementById("description-actuelle").textContent = now.weather[0].description;
      document.getElementById("icone-actuelle").src = getIconUrl(now.weather[0].icon);
      document.getElementById("icone-actuelle").alt = now.weather[0].description;
      document.getElementById("temp-min").textContent = Math.round(now.main.temp_min) + "°C";
      document.getElementById("temp-max").textContent = Math.round(now.main.temp_max) + "°C";

      const getPeriod = (hour) => data.list.find(item => item.dt_txt.includes(`${hour}:00:00`));

      const matin = getPeriod("06");
      const apresmidi = getPeriod("12");
      const soir = getPeriod("18");
      const nuit = getPeriod("00");

      if (matin) {
        document.getElementById("temp-matin").textContent = Math.round(matin.main.temp) + "°C";
        document.getElementById("icone-matin").src = getIconUrl(matin.weather[0].icon);
        document.getElementById("icone-matin").alt = matin.weather[0].description;
      }
      if (apresmidi) {
        document.getElementById("temp-apresmidi").textContent = Math.round(apresmidi.main.temp) + "°C";
        document.getElementById("icone-apresmidi").src = getIconUrl(apresmidi.weather[0].icon);
        document.getElementById("icone-apresmidi").alt = apresmidi.weather[0].description;
      }
      if (soir) {
        document.getElementById("temp-soir").textContent = Math.round(soir.main.temp) + "°C";
        document.getElementById("icone-soir").src = getIconUrl(soir.weather[0].icon);
        document.getElementById("icone-soir").alt = soir.weather[0].description;
      }
      if (nuit) {
        document.getElementById("temp-nuit").textContent = Math.round(nuit.main.temp) + "°C";
        document.getElementById("icone-nuit").src = getIconUrl(nuit.weather[0].icon);
        document.getElementById("icone-nuit").alt = nuit.weather[0].description;
      }
    })
    .catch(err => console.error("Erreur météo :", err));
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-city");

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const ville = input.value.trim();
        if (ville !== "") {
          afficherMeteo(ville);
        }
      }
    });
  }

  // Chargement par défaut (ex. Paris)
  afficherMeteo("Paris");
});
