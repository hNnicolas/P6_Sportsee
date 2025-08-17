import { useState } from "react";
import StartTraining from "./StartTraining";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Props {
  onClose: () => void;
  level: string;
  goal: string;
  availableDays: string[];
  age?: number;
  weight?: number;
}

export default function TrainingFlow({
  onClose,
  level,
  goal,
  availableDays,
  age,
  weight,
}: Props) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [trainingPlan, setTrainingPlan] = useState<WeekPlan[]>([]);
  const [localGoal, setLocalGoal] = useState(goal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  type Exercice = {
    nom: string;
    duree: string;
    repos: string;
  };

  type DayPlan = {
    day: string;
    session: string;
    exercices: Exercice[];
  };

  type WeekPlan = {
    week: string;
    days: DayPlan[];
  };

  const flattenPlan = (plan: any): WeekPlan[] => {
    // Récupère le plan d'entrainement depuis l'objet reçu
    const planEntrainement = plan?.plan_entrainement;
    if (!planEntrainement) return []; // Retourne un tableau vide si aucun plan

    const result: WeekPlan[] = []; // Tableau final pour stocker les semaines

    // Parcourt chaque semaine du plan
    Object.keys(planEntrainement).forEach((weekKey) => {
      const semaine = planEntrainement[weekKey];
      if (!semaine) return; // Ignore si la semaine est vide

      const days: DayPlan[] = []; // Tableau pour stocker les jours de la semaine

      // Parcourt chaque jour de la semaine
      Object.keys(semaine).forEach((dayKey) => {
        const jour = semaine[dayKey];
        if (!jour) return;

        // Ajoute le jour au tableau days avec session et exercices
        days.push({
          day: dayKey,
          session: jour.seance || "repos",
          exercices: jour.exercices || [],
        });
      });

      // Ajoute la semaine complète avec ses jours au résultat final
      result.push({
        week: weekKey,
        days,
      });
    });

    return result;
  };

  // Fonction pour générer le planning via le backend
  const generateTrainingPlan = async () => {
    // 1. Vérification des champs obligatoires
    if (
      !localGoal ||
      !startDate ||
      !level ||
      !availableDays.length ||
      age == null ||
      weight == null
    ) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    setError("");
    setLoading(true);

    // 2. Préparation du payload à envoyer au backend
    const payload = {
      level: level.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      goal: localGoal,
      availableDays,
      age,
      weight,
      startDate,
    };
    console.log("Envoi au backend :", payload);

    try {
      // 3. Appel HTTP POST vers l'API
      const response = await axios.post(
        "/api/training-plan/generate",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      try {
        const data = response.data;
        console.log("JSON reçu :", data);

        // 4. Si le planning est présent dans la réponse
        if (data.plan) {
          setTrainingPlan(flattenPlan(data.plan)); // Transforme pour affichage
          setStep(4); // Passe à l'étape d'affichage
        } else {
          // 5. En cas de réponse sans plan
          console.error("Le plan n'existe pas dans la réponse :", data);
          setError(
            "Le backend n'a pas renvoyé de planning valide. Voir la console pour plus de détails."
          );
        }
      } catch (err) {
        console.error("Erreur inattendue :", err);
        setError(
          "Une erreur inattendue est survenue. Voir la console pour plus de détails."
        );
      }
    } catch (err: any) {
      console.error("Erreur axios :", err.response?.data || err.message);
      setError(
        "Une erreur est survenue lors de la génération du planning. Voir la console pour plus de détails."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full p-6">
      {/* Étape 1 */}
      {step === 1 && <StartTraining onStart={() => setStep(2)} />}

      {/* Étape 2 : Objectif */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <FontAwesomeIcon
            icon={faBullseye}
            size="3x"
            className="text-[#0B23F4]"
          />
          <h2 className="text-xl font-semibold text-center">
            Quel est votre objectif principal ?
          </h2>
          <p className="text-center text-[#707070]">
            Choisissez l'objectif qui vous motive le plus
          </p>
          <div className="w-full flex justify-center">
            <div className="w-1/3 flex flex-col">
              <label className="text-[#707070] mb-2 text-left">Objectif</label>
              <input
                type="text"
                value={localGoal}
                onChange={(e) => setLocalGoal(e.target.value)}
                className="w-full h-16 p-3 border rounded text-[#707070] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0B23F4]"
              />
            </div>
          </div>

          <div className="flex justify-center w-full mt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-[#0B23F4] text-white rounded hover:bg-blue-700 transition"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 : Date de début */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <FontAwesomeIcon
            icon={faCalendarDays}
            size="3x"
            className="text-[#0B23F4]"
          />
          <h2 className="text-xl font-semibold text-center text-black">
            Quand souhaitez-vous commencer votre programme ?
          </h2>
          <p className="text-center text-black">
            Générez un programme d'une semaine à partir de la date de votre
            choix
          </p>
          <div className="w-full flex justify-center">
            <div className="w-1/3 flex flex-col">
              <label className="text-[#707070] mb-2 text-left">
                Date du début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-16 p-3 border rounded text-[#707070] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0B23F4]"
              />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-center gap-4 w-full mt-4">
            <button
              onClick={() => setStep(2)}
              className="w-12 h-8 flex items-center justify-center bg-gray-200 text-black rounded-full hover:bg-gray-300 transition"
            >
              ←
            </button>

            <button
              onClick={generateTrainingPlan}
              className="px-6 py-2 bg-[#0B23F4] text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Génération..." : "Générer mon planning"}
            </button>
          </div>
        </div>
      )}

      {/* Étape 4 : Affichage du plan */}
      {step === 4 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-xl font-semibold text-center text-black">
            Votre planning de la semaine
          </h2>
          <h3>Important pour définir un programme adapté</h3>
          {trainingPlan.map((week, wIndex) => (
            <div key={wIndex} className="mb-6">
              <h3 className="font-semibold">{week.week.replace("_", " ")}</h3>
              <ul className="ml-4">
                {week.days.map((day, dIndex) => (
                  <li key={dIndex} className="mb-2">
                    <strong>{day.day}</strong> - {day.session}
                    {day.exercices.length > 0 && (
                      <ul className="ml-4 text-gray-600">
                        {day.exercices.map((ex, eIndex) => (
                          <li key={eIndex}>
                            {ex.nom} - {ex.duree} - {ex.repos}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex justify-center w-full mt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
            >
              ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
