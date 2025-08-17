import React from "react";

interface StatisticsProps {
  duration: number; // durée totale en minutes
  distance: number; // distance totale en km
}

export default function UserStatistics({
  duration,
  distance,
}: StatisticsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        backgroundColor: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        marginLeft: "auto",
        width: "fit-content",
      }}
    >
      {/* Durée parcourue */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center w-[200px] gap-4">
        <span className="text-[#0B23F4] text-2xl font-bold">
          {Number(duration || 0).toFixed(1)}
        </span>

        <span className="text-[#B6BDFC] text-sm ml-2">Minutes</span>
      </div>

      {/* Distance parcourue */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center w-[200px] gap-4">
        <span className="text-[#F4320C] text-2xl font-bold">
          {Number(distance || 0).toFixed(1)}
        </span>

        <span className="text-[#FCC1B6] text-sm">Kilomètres</span>
      </div>
    </div>
  );
}
