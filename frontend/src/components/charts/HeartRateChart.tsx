import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeartRateChartProps {
  data: { day: string; min: number; max: number; avg: number }[];
}

export default function HeartRateChart({ data }: HeartRateChartProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const daysOrder = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const sortedDays = data
    .map((d) => d.day)
    .sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

  const visibleDays = sortedDays.slice(currentIndex, currentIndex + 4);

  const dataForChart = visibleDays.map((day) => {
    const found = data.find((d) => d.day === day);
    return found || { day, min: 0, max: 0, avg: 0 };
  });

  const weeklyAvg =
    Math.round(
      dataForChart.reduce((sum, item) => sum + item.avg, 0) /
        dataForChart.length
    ) || 0;

  // --- Gestion dynamique des dates ---
  const weekStart = new Date(); // date de référence (lundi de la semaine)
  function getDateFromDay(day: string) {
    const dayIndex = daysOrder.indexOf(day);
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  }
  function formatDate(date: Date) {
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }

  const startDate = visibleDays.length
    ? formatDate(getDateFromDay(visibleDays[0]))
    : "";
  const endDate = visibleDays.length
    ? formatDate(getDateFromDay(visibleDays[visibleDays.length - 1]))
    : "";

  return (
    <div
      style={{
        flexGrow: 0,
        flexShrink: 1,
        padding: "1rem",
        background: "#fff",
        borderRadius: "20px",
        boxSizing: "border-box",
        width: "500px",
        marginLeft: "-45px",
      }}
    >
      {/* Conteneur titre + navigation */}
      <div className="flex items-center justify-between mb-2">
        {/* Titre BPM */}
        <div>
          <div
            style={{
              fontSize: "1rem",
              color: "#ff2e2e",
              fontWeight: "bold",
            }}
          >
            {weeklyAvg} BPM
          </div>
          <div
            style={{
              color: "#707070",
              fontSize: "12px",
              marginTop: "0px",
              marginBottom: "10px",
            }}
          >
            Fréquence cardiaque moyenne
          </div>
        </div>

        {/* Navigation chevrons et plage de dates */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            disabled={currentIndex === 0}
            className={`
        w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
        border-gray-300 text-gray-600
        hover:bg-[#0B23F4] hover:text-white hover:border-[#0B23F4]
        disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300
      `}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm text-gray-600 px-3 whitespace-nowrap">
            {startDate} - {endDate}
          </span>

          <button
            onClick={() =>
              setCurrentIndex((i) => (i + 4 < sortedDays.length ? i + 1 : i))
            }
            disabled={currentIndex + 4 >= sortedDays.length}
            className={`
        w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
        border-gray-300 text-gray-600
        hover:bg-[#0B23F4] hover:text-white hover:border-[#0B23F4]
        disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300
      `}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={dataForChart}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={[130, 187]}
            ticks={[130, 145, 160, 187]}
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip contentStyle={{ fontSize: "0.8rem", padding: "5px 10px" }} />
          <Bar dataKey="min" fill="#ffc2c2" barSize={20} />
          <Bar dataKey="max" fill="#ff2e2e" barSize={20} />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#2f38dc"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.9rem",
          marginTop: 10,
          marginLeft: "35px",
          color: "#666",
        }}
      >
        <span>
          <span style={{ color: "#ffc2c2" }}>●</span> Min BPM
        </span>
        <span>
          <span style={{ color: "#ff2e2e" }}>●</span> Max BPM
        </span>
        <span>
          <span style={{ color: "#2f38dc" }}>●</span> Moy BPM
        </span>
      </div>
    </div>
  );
}
