// Route API Next.js pour gérer les favoris
import { supabase } from "../Supabase/supabaseclient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Ajout d'une ville aux favoris
    const { user_id, ville } = req.body;
    const { error } = await supabase
      .from("favoris")
      .insert({ user_id, ville });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }
  if (req.method === "GET") {
    // Récupération des favoris d'un utilisateur
    const { user_id } = req.query;
    const { data, error } = await supabase
      .from("favoris")
      .select("ville")
      .eq("user_id", user_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ favoris: data });
  }
  return res.status(405).json({ error: "Méthode non autorisée" });
}
