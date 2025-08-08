
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../Supabase/supabaseclient";

export default function Favoris() {
  const [favoris, setFavoris] = useState([]);
  const [newFavori, setNewFavori] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);;

  

  useEffect(() => {
    // Récupère l'utilisateur connecté
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        // Récupère le statut premium
        supabase
          .from("profiles")
          .select("premium")
          .eq("id", data.user.id)
          .single()
          .then(({ data }) => {
            setPremium(data?.premium || false);
          });
        // Récupère les favoris
        supabase
          .from("favoris")
          .select("id, nom_favoris, uuid")
          .eq("uuid", data.user.id)
          .then(({ data }) => {
            setFavoris(data || []);
          });
      }
    });
  }, []);

  const handleAddFavori = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("Vous devez être connecté.");
      return;
    }
    if (favoris.length >= 3) {
      setError("Limite de 3 favoris atteinte (abonnez-vous pour plus).");
      return;
    }
    const { error } = await supabase
      .from("favoris")
      .insert([{ uuid: user.id, nom_favoris: newFavori }]);
    if (error) {
      setError(error.message);
    } else {
      setFavoris([...favoris, { nom_favoris: newFavori }]);
      setNewFavori("");
    }
  };

  return (
    <div>
      <h3>Mes favoris</h3>
      <form onSubmit={handleAddFavori}>
        <input
          type="text"
          value={newFavori}
          onChange={e => setNewFavori(e.target.value)}
          placeholder="Ajouter un favori"
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {favoris.map((fav, idx) => (
          <li key={fav.id || idx}>{fav.nom_favoris}</li>
        ))}
      </ul>
      {!premium && <p style={{ color: "orange" }}>Abonnez-vous pour plus de favoris !</p>}
    </div>
  );
}
