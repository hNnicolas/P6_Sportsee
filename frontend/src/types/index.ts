// types.ts
export interface ExerciseType {
  nom: string;
  duree: number;
  repos?: number;
}

export interface DayType {
  seance: string;
  intensite: string;
  description: string;
  exercices: ExerciseType[];
}

export interface WeekType {
  [dayName: string]: DayType;
}

export interface TrainingPlan {
  [weekName: string]: WeekType;
}
