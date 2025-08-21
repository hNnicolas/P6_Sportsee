import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HeartRateChartProps {
  data: { day: string; min: number; max: number; avg: number }[];
}

export default function HeartRateChart({ data }: HeartRateChartProps) {
  const daysOrder = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const orderedData = [...data].sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );

  // Calcul du BPM moyen de la semaine
  const weeklyAvg =
    Math.round(
      orderedData.reduce((sum, item) => sum + item.avg, 0) / orderedData.length
    ) || 0;

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
      {/* Affichage du BPM moyen en gros */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div
          style={{
            fontSize: "1rem",
            color: "#ff2e2e",
            fontWeight: "bold",
            textAlign: "left",
            marginLeft: "10px",
          }}
        >
          {weeklyAvg} BPM
        </div>
        <div
          style={{
            color: "#707070",
            fontSize: "12px",
            textAlign: "left",
            marginTop: "5px",
            marginLeft: "10px",
          }}
        >
          Fréquence cardiaque moyenne
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={orderedData}
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
          <Tooltip
            contentStyle={{ fontSize: "0.8rem", padding: "5px 10px" }}
            itemStyle={{ padding: "2px 0" }}
          />
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
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.9rem",
          marginTop: 10,
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
