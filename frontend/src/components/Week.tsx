import { DayType } from "../types";

interface WeekProps {
  weekName: string;
  weekData: DayType[];
}

export default function Week({ weekName, weekData }: WeekProps) {
  console.log("Affichage weekData:", weekData);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{weekName}</h2>

      {weekData.map((day) => (
        <div key={day.nomJour} className="mb-4 pl-4 border-l-2 border-gray-200">
          <p className="font-medium">Jour: {day.nomJour}</p>
          <p className="mb-2">Séance: {day.seance}</p>
          <p className="mb-2">Intensité: {day.intensite}</p>
          <p className="mb-2">Description: {day.description}</p>

          {day.exercices.map((ex, i) => (
            <div key={i} className="ml-4 mb-2">
              <p>Nom: {ex.nom}</p>
              <p>Durée: {ex.duree}</p>
              {ex.repos && <p>Repos: {ex.repos}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
