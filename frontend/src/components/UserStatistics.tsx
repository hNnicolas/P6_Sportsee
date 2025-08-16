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
    <div className="flex gap-6">
      {/* Durée parcourue */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center w-[200px]">
        <span className="text-[#0B23F4] text-2xl font-bold">
          {Number(duration || 0).toFixed(1)}
        </span>

        <span className="text-[#B6BDFC] text-sm">Minutes</span>
      </div>

      {/* Distance parcourue */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center w-[200px]">
        <span className="text-[#F4320C] text-2xl font-bold">
          {Number(distance || 0).toFixed(1)}
        </span>

        <span className="text-[#FCC1B6] text-sm">Kilomètres</span>
      </div>
    </div>
  );
}
