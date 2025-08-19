import type { NextApiRequest, NextApiResponse } from "next";

type TrainingPlanRequest = {
  level: string; // "débutant" | "intermédiaire" | "avancé"
  goal: string; // "5km", "10km", "semi", "marathon", "libre"
  availableDays: string[]; // ex: ["lundi", "mercredi", "vendredi"]
  age?: number;
  weight?: number;
};

type TrainingPlanResponse = {
  plan: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingPlanResponse | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { level, goal, availableDays, age, weight } =
    req.body as TrainingPlanRequest;

  if (!level || !goal || !availableDays) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Clé API Mistral manquante dans .env.local");
    }

    const systemPrompt = `
Tu es un coach sportif virtuel expert en course à pied.
Génère un plan d'entraînement structuré au format JSON.
Niveau utilisateur : ${level}
Objectif course : ${goal}
Jours disponibles : ${availableDays.join(", ")}
${age ? `Age : ${age}` : ""} ${weight ? `Poids : ${weight} kg` : ""}
Règles :
- Fournis un plan pour chaque semaine jusqu'à la date objectif
- Pour chaque jour disponible, indique :
  - seance : endurance, fractionné ou repos
  - exercices : toujours un tableau, même si un seul exercice
    - nom : description de l'exercice
    - duree : durée de l'exercice
    - repos : durée du repos
- Ne jamais changer le type des champs
- Répond uniquement en JSON valide, ASCII pour les clés, sans texte supplémentaire
`.replace(/\n/g, " ");

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
            {
              role: "user",
              content:
                "Répond uniquement en JSON strict, ne rien ajouter d'autre",
            },
          ],
        }),
      }
    );

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      throw new Error(`Erreur Mistral: ${errText}`);
    }

    const data = await mistralRes.json();
    const planJSON = data.choices?.[0]?.message?.content;

    if (!planJSON) {
      throw new Error("Mistral n'a pas renvoyé de contenu.");
    }

    console.log("Plan brut Mistral :", planJSON);

    // Fonction utilitaire pour normaliser les clés après parsing
    function normalizeKeys(obj: any): any {
      if (Array.isArray(obj)) return obj.map(normalizeKeys);
      if (obj && typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
          const normalizedKey = key
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_");
          newObj[normalizedKey] = normalizeKeys(obj[key]);
        }
        return newObj;
      }
      return obj;
    }

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(planJSON); // Parse brut, pas de nettoyage agressif
    } catch (err) {
      console.error("JSON invalide reçu de Mistral :", planJSON);
      throw new Error("Le JSON retourné par Mistral est invalide");
    }

    const plan = normalizeKeys(parsedPlan);

    res.status(200).json({ plan });
  } catch (error: any) {
    console.error("Erreur API training plan :", error);
    res.status(500).json({ error: error.message || "Erreur interne" });
  }
}
