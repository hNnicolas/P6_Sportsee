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

export default function useUserPrompt(user: string | UserProfile) {
  return useMemo(() => {
    let level = typeof user === "string" ? user : user.level;

    let extraData = "";
    if (typeof user !== "string") {
      const { age, weightKg, goal, recentRuns } = user;
      extraData = `
Profil utilisateur :
- Age : ${age ?? "non renseigné"}
- Poids : ${weightKg ?? "non renseigné"} kg
- Objectif : ${goal ?? "non renseigné"}
`;

      if (recentRuns && recentRuns.length > 0) {
        const lastRuns = recentRuns
          .slice(-10)
          .map(
            (r, i) =>
              `  ${i + 1}. ${r.date} - ${r.distanceKm} km en ${
                r.durationMin
              } min (FC moy : ${r.avgHeartRate})`
          )
          .join("\n");
        extraData += `Dernières courses :\n${lastRuns}\n`;
      }
    }

    return `
Tu es un coach sportif virtuel.
Ton rôle est de conseiller des utilisateurs sur entraînement, nutrition et récupération.
Ton ton : motivant et clair.
Niveau utilisateur : ${level}.
Adapte tes conseils pour que l'utilisateur ${
      level === "débutant"
        ? "comprenne facilement"
        : level === "intermédiaire"
        ? "puisse améliorer ses performances"
        : "atteigne un haut niveau de performance"
    }.
${extraData}
Limite les réponses à 3-4 phrases.
`;
  }, [user]);
}
