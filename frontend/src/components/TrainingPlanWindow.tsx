import { useState, useEffect } from "react";
import Week from "./Week";
import { DayType, TrainingPlan } from "../types";

interface Props {
  onClose: () => void;
  level: string;
  goal: string;
  availableDays: string[];
  age?: number;
  weight?: number;
}

export default function TrainingPlanWindow({
  onClose,
  level,
  goal,
  availableDays,
  age,
  weight,
}: Props) {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/training-plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level, goal, availableDays, age, weight }),
      });

      console.log("Réponse fetch", response.status, response.statusText);

      if (!response.ok) {
        const text = await response.text();
        console.error("Réponse non OK complète :", {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });
        throw new Error(
          `Erreur lors de la génération du plan: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Données reçues", data);

      setPlan(data.plan.planning_entrainement || data.plan);
    } catch (err: any) {
      setError(err.message);
      console.error("Erreur fetchPlan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 mb-4"
        >
          Fermer
        </button>

        <h1 className="text-2xl font-bold mb-4">Plan d'entraînement</h1>

        {loading && <p>Chargement du plan...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={fetchPlan}
        >
          Régénérer le plan
        </button>

        {plan &&
          Object.entries(plan).map(([weekName, weekData]) => {
            // Transformer l'objet {lundi: {...}, mardi: {...}} en tableau DayType[]
            const daysArray: DayType[] = Object.entries(weekData).map(
              ([dayName, day]) => ({
                nomJour: dayName,
                seance: day.seance,
                intensite: day.intensite || "—",
                description: day.description || "—",
                exercices: day.exercices || [],
              })
            );

            return (
              <Week key={weekName} weekName={weekName} weekData={daysArray} />
            );
          })}
      </div>
    </div>
  );
}
