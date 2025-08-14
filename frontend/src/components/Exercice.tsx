import { ExerciseType } from "../types";

interface Props {
  exercise: ExerciseType;
}

export default function Exercise({ exercise }: Props) {
  return (
    <li className="p-2 bg-gray-50 rounded flex justify-between">
      <span>{exercise.nom}</span>
      <span>
        {exercise.duree} min{" "}
        {exercise.repos ? `| Repos: ${exercise.repos} min` : ""}
      </span>
    </li>
  );
}
