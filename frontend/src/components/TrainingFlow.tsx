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
  const [trainingPlan, setTrainingPlan] = useState<
    { day: string; activity: string }[]
  >([]);
  const [localGoal, setLocalGoal] = useState(goal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const flattenPlan = (plan: any) => {
    const result: { day: string; activity: string }[] = [];

    const planEntraînement = plan?.plan_entrainement;

    if (!planEntraînement) {
      return result;
    }

    Object.keys(planEntraînement).forEach((semaineKey) => {
      const semaine = planEntraînement[semaineKey];
      if (!semaine) return;

      Object.keys(semaine).forEach((jourKey) => {
        const jour = semaine[jourKey];
        if (!jour) return;

        result.push({
          day: `${semaineKey.replace("_", " ")} - ${jourKey}`,
          activity: jour.seance,
        });
      });
    });

    return result;
  };

  // Fonction pour générer le planning via le backend
  const generateTrainingPlan = async () => {
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

    const payload = {
      level,
      goal: localGoal,
      availableDays,
      age,
      weight,
      startDate,
    };
    console.log("Envoi au backend :", payload);

    try {
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

        if (data.plan) {
          setTrainingPlan(flattenPlan(data.plan));
          setStep(4);
        } else {
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
            Votre planning d'entraînement
          </h2>
          {trainingPlan.length === 0 ? (
            <p>Aucun planning disponible</p>
          ) : (
            <ul className="w-full">
              {trainingPlan.map((item, index) => (
                <li
                  key={index}
                  className="border-b py-2 flex justify-between text-[#707070]"
                >
                  <span>{item.day}</span>
                  <span>{item.activity}</span>
                </li>
              ))}
            </ul>
          )}

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
