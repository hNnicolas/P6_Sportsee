import { useMemo } from "react";

// Structure d’une course récente
type RecentRun = {
  date: string;
  distanceKm: number;
  durationMin: number;
  avgHeartRate: number;
};

// Profil utilisateur enrichi (infos + historique courses)
export type UserProfile = {
  level: string;
  age?: number;
  weightKg?: number;
  goal?: string;
  recentRuns?: RecentRun[];
};

// --- Fonctions utilitaires ---
// Détermine le niveau (débutant, intermédiaire, avancé)
// basé sur la vitesse moyenne des 3 dernières courses
function calculateLevelFromRuns(runs: RecentRun[]): string {
  if (!runs.length) return "débutant";
  const lastRuns = runs.slice(-3);

  // vitesse = distance / durée (en heures)
  const avgSpeed =
    lastRuns.reduce((acc, r) => acc + r.distanceKm / (r.durationMin / 60), 0) /
    lastRuns.length;

  if (avgSpeed > 13) return "avancé";
  if (avgSpeed > 10) return "intermédiaire";
  return "débutant";
}

// Calcule l’allure moyenne (min/km) sur les 5 dernières courses
function calculateAveragePace(runs: RecentRun[]): string {
  if (!runs.length) return "non défini";
  const lastRuns = runs.slice(-5);

  // allure = temps total (min) / distance (km)
  const avgPaceMinPerKm =
    lastRuns.reduce((acc, r) => acc + r.durationMin / r.distanceKm, 0) /
    lastRuns.length;
  return `${avgPaceMinPerKm.toFixed(1)} min/km`;
}

// --- Hook principal ---
// Génère une "prompt" (instruction) adaptée pour un coach virtuel
// en fonction du profil et de l’historique utilisateur
export default function useUserPrompt(user: string | UserProfile) {
  return useMemo(() => {
    // Niveau de départ (soit string direct, soit extrait du profil)
    let level = typeof user === "string" ? user : user.level;
    let extraData = "";

    // Si on a un profil utilisateur complet (pas juste un string)
    if (typeof user !== "string") {
      const { age, weightKg, goal, recentRuns } = user;

      // Si on a des courses récentes -> recalcul du niveau + ajout des stats
      if (recentRuns?.length) {
        level = calculateLevelFromRuns(recentRuns);

        const avgPace = calculateAveragePace(recentRuns);

        // Formattage lisible des 5 dernières courses
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

      // Infos générales de l’utilisateur
      extraData = `
Profil utilisateur :
- Âge : ${age ?? "non renseigné"}
- Poids : ${weightKg ?? "non renseigné"} kg
- Objectif : ${goal ?? "non renseigné"}
${extraData}
      `;
    }

    // Détermine le ton de coaching selon le niveau
    const coachingTone =
      level === "débutant"
        ? "comprenne facilement"
        : level === "intermédiaire"
        ? "puisse améliorer ses performances"
        : "atteigne un haut niveau de performance";

    // Prompt final envoyé au modèle IA
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
  }, [user]); // recalcul si `user` change
}
