import React from "react";

interface StartTrainingProps {
  onStart: () => void;
}

export default function StartTraining({ onStart }: StartTrainingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 !bg-white rounded-xl shadow-md gap-4">
      <img
        src="/images/icons/calendar.png"
        alt="Calendar"
        className="text-[#0B23F4] mt-[50px] mb-[20px]"
        style={{ width: "80px", height: "80px" }}
      />

      <h2
        className="text-center"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 550,
          fontSize: "26px",
          color: "#111111",
          lineHeight: "32px",
        }}
      >
        Créez votre planning d'entraînement
        <br />
        intelligent
      </h2>

      <p className="text-center text-gray-500">
        Notre IA vous aide à bâtir un planning 100 % personnalisé selon vos
        objectifs, votre
        <br />
        niveau et votre emploi du temps.
      </p>
      <button
        onClick={onStart}
        className="mt-4 bg-[#0B23F4] !text-white border border-transparent rounded-lg hover:bg-blue-700 transition"
        style={{
          height: "60px",
          width: "180px",
          fontSize: "18px",
        }}
      >
        Commencer
      </button>
    </div>
  );
}
