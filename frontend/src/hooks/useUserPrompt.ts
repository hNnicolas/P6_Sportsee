import { useMemo } from "react";

type RecentRun = {
  date: string;
  distanceKm: number;
  durationMin: number;
  avgHeartRate: number;
};

export type UserProfile = {
  level: string;
  age?: number;
  weightKg?: number;
  goal?: string;
  recentRuns?: RecentRun[];
};

// Calcul du niveau à partir des 3 dernières courses
function calculateLevelFromRuns(runs: RecentRun[]): string {
  if (!runs.length) return "débutant";
  const lastRuns = runs.slice(-3);
  const avgSpeed =
    lastRuns.reduce((acc, r) => acc + r.distanceKm / (r.durationMin / 60), 0) /
    lastRuns.length;

  if (avgSpeed > 13) return "avancé";
  if (avgSpeed > 10) return "intermédiaire";
  return "débutant";
}

// Calcul de l’allure moyenne à partir des 5 dernières courses
function calculateAveragePace(runs: RecentRun[]): string {
  if (!runs.length) return "non défini";
  const lastRuns = runs.slice(-5);
  const avgPaceMinPerKm =
    lastRuns.reduce((acc, r) => acc + r.durationMin / r.distanceKm, 0) /
    lastRuns.length;
  return `${avgPaceMinPerKm.toFixed(1)} min/km`;
}

export default function useUserPrompt(user: string | UserProfile) {
  return useMemo(() => {
    let level = typeof user === "string" ? user : user.level;
    let extraData = "";

    if (typeof user !== "string") {
      const { age, weightKg, goal, recentRuns } = user;

      if (recentRuns?.length) {
        level = calculateLevelFromRuns(recentRuns);

        const avgPace = calculateAveragePace(recentRuns);
        const lastRunsText = recentRuns
          .slice(-5)
          .map(
            (r, i) =>
              `${i + 1}. ${r.date} - ${r.distanceKm} km en ${
                r.durationMin
              } min (FC moy : ${r.avgHeartRate})`
          )
          .join("\n");

        extraData += `
Allure moyenne récente : ${avgPace}
Dernières courses :
${lastRunsText}
        `;
      }

      extraData = `
Profil utilisateur :
- Âge : ${age ?? "non renseigné"}
- Poids : ${weightKg ?? "non renseigné"} kg
- Objectif : ${goal ?? "non renseigné"}
${extraData}
      `;
    }

    const coachingTone =
      level === "débutant"
        ? "comprenne facilement"
        : level === "intermédiaire"
        ? "puisse améliorer ses performances"
        : "atteigne un haut niveau de performance";

    return `
Tu es un coach sportif virtuel. Ton rôle est de conseiller des utilisateurs sur entraînement, nutrition et récupération. 
Ton ton : motivant et clair. 
Niveau utilisateur : ${level}. 
Adapte tes conseils pour que l'utilisateur ${coachingTone}.
${extraData}

IMPORTANT :
Réponds **UNIQUEMENT** avec un JSON valide.
- Tous les champs doivent être présents, même si vides.
- Ne mets jamais de '...' ou de texte avant/après le JSON.
- Valeurs inconnues : "" ou null

Format attendu :

{
  "semaine1": [
    {"jour": "lundi", "activité": "footing", "distance": "5 km", "détails": ""},
    {"jour": "mercredi", "activité": "fractionné", "détails": "8x400m"}
  ],
  "semaine2": [
    {"jour": "vendredi", "activité": "sortie longue", "distance": "10 km", "détails": ""}
  ]
}
    `;
  }, [user]);
}
