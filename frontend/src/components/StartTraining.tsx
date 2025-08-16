import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

interface StartTrainingProps {
  onStart: () => void;
}

export default function StartTraining({ onStart }: StartTrainingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 !bg-white rounded-xl shadow-md gap-4">
      <FontAwesomeIcon
        icon={faCalendarDays}
        style={{ color: "#0B23F4", fontSize: "3rem" }}
      />
      <h2 className="text-xl font-bold text-center">
        Créez votre planning d'entraînement intelligent
      </h2>
      <p className="text-center text-gray-500">
        Notre IA vous aide à bâtir un planning 100 % personnalisé selon vos
        objectifs, votre niveau et votre emploi du temps.
      </p>
      <button
        onClick={onStart}
        className="mt-4 px-6 py-2 bg-[#0B23F4] !text-white border border-transparent rounded-lg hover:bg-blue-700 transition"
      >
        Commencer
      </button>
    </div>
  );
}
