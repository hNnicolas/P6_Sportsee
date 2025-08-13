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
  data: { week: string; km: number }[];
}

export default function WeeklyDistanceChart({
  data,
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

  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h4 style={{ marginBottom: 10, textAlign: "center" }}>
        Total des kilomètres 4 dernières semaines :{" "}
        <strong>{totalDistance.toFixed(2)} km</strong>
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dataForChart}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#a2b3ff", strokeWidth: 1 }}
          />
          <YAxis ticks={[0, 10, 20, 30]} domain={[0, 30]} />
          <Tooltip />
          <Bar dataKey="km" fill="#a2b3ff" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#666",
          marginTop: 10,
        }}
      >
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          style={{ marginRight: 10 }}
        >
          ←
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => (i + 4 < sortedWeeks.length ? i + 1 : i))
          }
          disabled={currentIndex + 4 >= sortedWeeks.length}
        >
          →
        </button>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#666",
          marginTop: 10,
        }}
      >
        <span style={{ color: "#2f38dc" }}>●</span> Km
      </div>
    </div>
  );
}
