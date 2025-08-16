import { useState } from "react";
import StartTraining from "./StartTraining";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function TrainingFlow() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");

  return (
    <div className="flex justify-center items-center w-full p-6">
      {/* Étape 1 */}
      {step === 1 && <StartTraining onStart={() => setStep(2)} />}

      {/* Étape 2 */}
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
            Choisissez l'objectif qui vous motive le plus ?
          </p>
          <div className="w-full flex justify-center">
            <div className="w-1/3 flex flex-col">
              <label className="text-[#707070] mb-2 text-left">Objectif</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
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

      {/* Étape 3 */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <FontAwesomeIcon
            icon={faCalendar}
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
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-16 p-3 border rounded text-[#707070] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0B23F4]"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 w-full mt-4">
            <button
              onClick={() => setStep(2)}
              className="w-12 h-10 flex items-center justify-center bg-gray-200 text-black rounded-full hover:bg-gray-300 transition"
            >
              ←
            </button>

            <button
              onClick={() =>
                console.log("Planning généré à partir de :", startDate)
              }
              className="px-6 py-2 bg-[#0B23F4] text-white rounded hover:bg-blue-700 transition"
            >
              Générer mon planning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
