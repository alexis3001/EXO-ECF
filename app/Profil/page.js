

"use client"
import { useState, useEffect } from "react";
import { supabase } from "../../Supabase/supabaseclient";


export default function Profil() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [premium, setPremium] = useState(false);
  const [favoris, setFavoris] = useState([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSuccess("");
    setError("");
    setUser(null);
    setPremium(false);
  };



  

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
        // Récupère les favoris de l'utilisateur
        supabase
          .from("favoris")
          .select("ville")
          .eq("user_id", data.user.id)
          .then(({ data, error }) => {
            if (!error && data) setFavoris(data.map(f => f.ville));
          });
      } else {
        setError("Vous devez être connecté pour accéder à cette page.");
      }
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // CRUD faux abonnement
  const handlePremium = async () => {
  setLoading(true);
  setSuccess("");

  // 👇 Récupère l'utilisateur authentifié (auth.users)
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    setError(userError.message);
    setLoading(false);
    return;
  }

  // 👇 Mise à jour de la table profiles (par exemple)
  const { error } = await supabase
    .from("profiles")
    .update({ premium: true })
    .eq("id", user.id); // OK ici, profiles.id == auth.users.id

  if (error) {
    setError(error.message);
  } else {
    setPremium(true);
    setSuccess("Abonnement premium activé !");

    // ✅ Appel avec le bon userId (auth.users.id)
    await logPremiumActivation(user.id);
  }

  setLoading(false);
};

<button className="btn" style={{marginTop: 20}} onClick={() => window.location.href = "/"}>
            Retour au menu principal
          </button>


  // Fonction pour envoyer les données d'activation à Supabase (table premium_log)
 const logPremiumActivation = async (userId) => {
  const { error } = await supabase
    .from("premium_log")
    .insert([
      {
        user_id: userId,            // ✅ Doit exister dans auth.users
        activated_at: new Date(),
        date_debut: new Date(),     // Si nécessaire
      }
    ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement de l'activation premium:", error.message);
  }
};
  

  // Fonction pour ajouter une ville aux favoris
  const addFavoris = async (ville) => {
    if (!user) return;
    const { error } = await supabase
      .from("favoris")
      .insert({ user_id: user.id, ville });
    if (error) {
      setError(error.message);
    } else {
      setFavoris(prev => [...prev, ville]);
      setSuccess(`Ville "${ville}" ajoutée aux favoris !`);
    }
  };

  const DeleteFavoris = async (ville) => {
    if (!user) return;
    const { error } = await supabase
      .from("favoris")
      .delete()
      .eq("user_id", user.id)
      .eq("ville", ville);
    if (error) {
      setError(error.message);
    } else {
      delete favoris.filter(f => f !== ville);
      setSuccess(`Ville "${ville}" supprimée des favoris !`);
    }}

  const handleCancelPremium = async () => {
    setLoading(true);
    setSuccess("");
    const { error } = await supabase
      .from("profiles")
      .update({ premium: false })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setPremium(false);
      setSuccess("Abonnement premium annulé.");
    }
  };

  const handleDeletePremium = async () => {
    setLoading(true);
    setSuccess("");
    const { error } = await supabase
      .from("profiles")
      .update({ premium: null })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setPremium(false);
      setSuccess("Abonnement premium supprimé.");
    }
    
  };

  return (
    
    <main className="main-container">
      <h1>Profil</h1>
      {error && <p className="error">{error}</p>}
      {success && <p style={{color: "green"}}>{success}</p>}
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>Statut Premium: {premium ? "Oui" : "Non"}</p>
          <div style={{marginTop: 20}}>
            <h3>Villes en favoris :</h3>
            {favoris.length === 0 ? (
              <p>Aucune ville en favoris.</p>
            ) : 
            
            (
              <ul className="liste">
  {favoris.map((ville, idx) => (
    <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '250px' }}>
      <span>{ville}</span>
      <button
        onClick={() => DeleteFavoris(ville)}
        style={{
          backgroundColor: '#13ae1bff',
          color: 'white',
          border: 'none',
          padding: '10px 10px',
          cursor: 'pointer',
          borderRadius: '10px',
          marginLeft: '10px',
          display: 'flex',
          alignSelf: 'center',
          transition: 'background-color 0.3s',
          space: 'between'
        }}
      >
        Supprimer
      </button>
    </li>
  ))}
</ul>

            )}
          </div>
          {!premium && (
            <button className="btn" onClick={handlePremium} disabled={loading} style={{marginTop: 10}}>
              {loading ? "Activation..." : "Activer l'abonnement premium"}
            </button>
          )}

          <button className="btn" style={{marginTop: 20}} onClick={() => window.location.href = "/"}>
            Retour au menu principal
          </button>
          <button className="btn" onClick={handleLogout} disabled={loading} style={{marginTop: 10, marginLeft: 10, background: '#13ae1bff'}}>
                {loading ? "Suppression..." : "ce deconnecter"}
              </button>
          {premium && (
            <>
              <button className="btn" onClick={handleCancelPremium} disabled={loading} style={{marginTop: 10, marginLeft: 10}}>
                {loading ? "Annulation..." : "Annuler l'abonnement"}
              </button>
              <button className="btn" onClick={handleDeletePremium} disabled={loading} style={{marginTop: 10, marginLeft: 10, background: '#13ae1bff'}}>
                {loading ? "Suppression..." : "Supprimer l'abonnement"}
              </button>

            </>
            
          )}
        </div>
      )}
    </main>
  );
}