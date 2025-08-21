import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyDistanceChartProps {
  data?: { week: string; km: number }[];
}

export default function WeeklyDistanceChart({
  data = [
    { week: "S1", km: 15.2 },
    { week: "S2", km: 22.8 },
    { week: "S3", km: 18.5 },
    { week: "S4", km: 25.1 },
    { week: "S5", km: 12.3 },
    { week: "S6", km: 28.7 },
  ],
}: WeeklyDistanceChartProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedWeeks = data
    .map((d) => d.week)
    .sort((a, b) => a.localeCompare(b));
  let weeksOrder = sortedWeeks.slice(currentIndex, currentIndex + 4);

  while (weeksOrder.length < 4) {
    const lastWeek = weeksOrder.length
      ? weeksOrder[weeksOrder.length - 1]
      : sortedWeeks[sortedWeeks.length - 1] || "S0";
    const weekNum = parseInt(lastWeek.slice(1), 10);
    weeksOrder.push(`S${weekNum + 1}`);
  }

  const dataForChart = weeksOrder.map((week) => {
    const found = data.find((d) => d.week === week);
    return { week, km: found ? found.km : 0 };
  });

  const totalDistance = dataForChart.reduce((sum, entry) => sum + entry.km, 0);

  const chartHeight = 220; // tu peux adapter selon l'écran si tu veux

  return (
    <div
      className="flex flex-col justify-center p-4 sm:p-6 md:p-8 max-w-full mx-auto"
      style={{
        backgroundColor: "white",
        height: "410px",
        width: "500px",
        borderRadius: "20px",
        marginLeft: "-30px",
      }}
    >
      {" "}
      <h4
        className="text-left text-[1rem] font-bold text-[#0B23F4]"
        style={{ marginLeft: "30px" }}
      >
        {totalDistance.toFixed(0)} km en moyenne
      </h4>
      <p
        className="text-left text-[0.75rem] text-[#707070] mb-2"
        style={{ marginTop: "-10px", marginLeft: "30px" }}
      >
        Total des kilomètres 4 dernières semaines
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={dataForChart}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="week"
            tick={{ fontSize: 14 }}
            tickLine={{ stroke: "#a2b3ff", strokeWidth: 1 }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            ticks={[0, 10, 20, 30]}
            domain={[0, 30]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 14,
            }}
            formatter={(value, name) => [
              `${value} km`,
              name === "km" ? "Distance" : name,
            ]}
          />
          <Bar
            dataKey="km"
            fill="#a2b3ff"
            radius={[5, 5, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-4 sm:mt-5 md:mt-6 space-x-2">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          className={`px-3 py-1 border rounded cursor-pointer text-sm transition ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-white"
              : "hover:bg-gray-100 border-gray-300 bg-white active:translate-y-[1px]"
          }`}
        >
          ← Précédent
        </button>
        <span className="mx-2 text-gray-600 text-sm">
          {Math.floor(currentIndex / 4) + 1} /{" "}
          {Math.ceil(sortedWeeks.length / 4)}
        </span>
        <button
          onClick={() =>
            setCurrentIndex((i) => (i + 4 < sortedWeeks.length ? i + 1 : i))
          }
          disabled={currentIndex + 4 >= sortedWeeks.length}
          className={`px-3 py-1 border rounded cursor-pointer text-sm transition ${
            currentIndex + 4 >= sortedWeeks.length
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-white"
              : "hover:bg-gray-100 border-gray-300 bg-white active:translate-y-[1px]"
          }`}
        >
          Suivant →
        </button>
      </div>
      <div className="text-center mt-2 text-gray-600 text-sm">
        <span className="text-[#2f38dc] text-lg">●</span> Km parcourus
      </div>
    </div>
  );
}
