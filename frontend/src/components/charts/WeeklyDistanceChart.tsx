import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fonction pour calculer les dates de début et fin de semaine (6 derniers jours)
  function getWeekDates(lastDay: Date) {
    const end = new Date(lastDay);
    const start = new Date(lastDay);
    start.setDate(end.getDate() - 6); // prend les 6 derniers jours
    const formatDate = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}.${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }

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

  // Création des données pour le graphique
  const dataForChart = weeksOrder.map((week) => {
    const found = data.find((d) => d.week === week);
    const km = found ? found.km : 0;
    const avgLast6Days = km / 6;

    // Calcul dynamique de la date de fin de semaine
    const lastDay = found
      ? new Date(2025, 5, 1 + parseInt(found.week.slice(1)) * 7) // S1 -> 01/06/2025 + 7*j
      : new Date();
    const { startDate, endDate } = getWeekDates(lastDay);

    return { week, km, avgLast6Days, startDate, endDate };
  });

  const totalDistance = dataForChart.reduce((sum, entry) => sum + entry.km, 0);
  const chartHeight = 300;

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { startDate, endDate, km } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          <div>{`${startDate} au ${endDate}`}</div>
          <div>{`${km} km`}</div>
        </div>
      );
    }
    return null;
  };

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
      <div className="flex items-center justify-between px-[30px]">
        <h4 className="text-[18px] font-bold text-[#0B23F4] mt-0px]">
          {totalDistance.toFixed(0)} km en moyenne
        </h4>

        <div className="flex items-center space-x-2 mt-[10px] mr-[-20px]">
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
            28 mai - 25 juin
          </span>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i + 4 < sortedWeeks.length ? i + 1 : i))
            }
            disabled={currentIndex + 4 >= sortedWeeks.length}
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

      <p className="text-left text-[0.75rem] text-[#707070] mb-2 px-[30px] -mt-[20px]">
        Total des kilomètres 4 dernières semaines
      </p>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={dataForChart}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barCategoryGap="20%"
          barGap={4}
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
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="km"
            radius={[5, 5, 0, 0]}
            maxBarSize={15}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {dataForChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? "#0B23F4" : "#a2b3ff"}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="text-left mt-2 text-gray-600 text-[12px]">
        <span className="text-[#7A86FF] text-[12px] ml-[60px]">●</span> Km
      </div>
    </div>
  );
}
