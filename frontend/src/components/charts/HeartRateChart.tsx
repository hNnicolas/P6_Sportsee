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

  return (
    <div style={{ flex: 1, padding: 20, background: "#fff", borderRadius: 12 }}>
      <h4 style={{ marginBottom: 10, textAlign: "center" }}>
        Fréquence cardiaque moyenne
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={orderedData}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis domain={[130, 187]} ticks={[130, 145, 160, 187]} />
          <Tooltip />
          <Bar dataKey="min" fill="#ffc2c2" />
          <Bar dataKey="max" fill="#ff2e2e" />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#2f38dc"
            strokeWidth={2}
            dot
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          fontSize: 12,
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
