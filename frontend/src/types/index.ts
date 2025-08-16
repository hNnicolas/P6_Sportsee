export interface ExerciseType {
  nom: string;
  duree: number;
  repos?: number;
}

export interface DayType {
  nomJour: string; // Nom du jour ajouté pour le composant Week
  seance: string;
  intensite: string;
  description: string;
  exercices: ExerciseType[];
}

// WeekType correspond toujours à l'objet brut du plan provenant du backend
export interface WeekType {
  jours: Omit<DayType, "nomJour">[]; // le backend renvoie un tableau de jours
}

// TrainingPlan correspond au plan complet tel que reçu
export interface TrainingPlan {
  [weekName: string]: WeekType;
}

// Props pour le composant Week
export interface WeekProps {
  weekName: string;
  weekData: DayType[]; // Tableau utilisé dans le composant pour itérer
}
