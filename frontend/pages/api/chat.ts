import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Clé API Mistral manquante dans .env.local");
    }

    // Prompt optimisé pour le coach IA
    const systemPrompt = `
Tu es un coach sportif virtuel. 
Ton rôle est de conseiller des utilisateurs sur :
- l'entraînement physique (endurance, force, récupération),
- la nutrition adaptée à leurs objectifs,
- la prévention et la gestion des blessures légères.

Ton ton doit être :
- motivant et encourageant,
- clair et précis, mais accessible,
- professionnel mais humain.

Règles :
- Si une information manque, demande des précisions plutôt que d'inventer,
- Si la question est hors sujet, réponds poliment que tu ne peux pas répondre,
- Limite les réponses à 3-4 phrases maximum,
- Maintiens toujours le persona de coach.
`;

    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            { role: "system", content: systemPrompt }, 
            { role: "user", content: message },
          ],
        }),
      }
    );

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      throw new Error(`Erreur Mistral: ${errText}`);
    }

    const data = await mistralRes.json();
    const botResponse = data.choices?.[0]?.message?.content || "Réponse vide";

    res.status(200).json({ response: botResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur interne" });
  }
}
