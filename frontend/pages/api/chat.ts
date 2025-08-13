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
    console.log("Clé API récupérée :", process.env.MISTRAL_API_KEY);
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Clé API Mistral manquante dans .env.local");
    }

    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-tiny", // ou mistral-small, mistral-medium...
          messages: [
            { role: "system", content: "Tu es un assistant utile et amical." },
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
