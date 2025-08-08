// Route API Next.js pour gérer l'abonnement premium
import { supabase } from "../Supabase/supabaseclient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Active l'abonnement premium pour l'utilisateur
    const { user_id } = req.body;
    const { error } = await supabase
      .from("profiles")
      .update({ premium: true })
      .eq("id", user_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }
  if (req.method === "DELETE") {
    // Désactive l'abonnement premium pour l'utilisateur
    const { user_id } = req.body;
    const { error } = await supabase
      .from("profiles")
      .update({ premium: false })
      .eq("id", user_id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: "Méthode non autorisée" });
}
