import Exercise from "./Exercice";
import { DayType } from "../types";

interface Props {
  dayName: string;
  dayData: DayType;
}

export default function Day({ dayName, dayData }: Props) {
  return (
    <div className="mb-4 p-3 border rounded">
      <h3 className="font-medium">
        {dayName.charAt(0).toUpperCase() + dayName.slice(1)} - {dayData.seance}(
        {dayData.intensite})
      </h3>
      <p className="text-gray-600">{dayData.description}</p>

      {dayData.exercices.length === 0 ? (
        <p className="text-gray-500 mt-1">Repos</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {dayData.exercices.map((ex, index) => (
            <Exercise key={index} exercise={ex} />
          ))}
        </ul>
      )}
    </div>
  );
}
