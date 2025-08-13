import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#2f38dc", "#e8e8e8"];

interface WeeklyGoalDonutProps {
  completed: number;
  total: number;
}

export default function WeeklyGoalDonut({
  completed,
  total,
}: WeeklyGoalDonutProps) {
  const goalData = [
    { name: "Réalisées", value: completed },
    { name: "Restantes", value: total - completed },
  ];

  return (
    <div
      style={{
        maxWidth: 300,
        margin: "2rem auto",
        textAlign: "center",
        background: "#fff",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ marginBottom: 0 }}>Cette semaine</h4>
      <p style={{ fontSize: 12, color: "#888" }}>Du 23/06/2025 au 30/06/2025</p>
      <p style={{ margin: "0.5rem 0", fontWeight: 600 }}>
        <span style={{ color: "#2f38dc" }}>x{completed}</span> sur objectif de{" "}
        {total}
      </p>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Courses hebdomadaire réalisées
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={goalData}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
          >
            {goalData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p
        style={{
          marginTop: -130,
          fontSize: 16,
          fontWeight: "bold",
          color: "#2f38dc",
        }}
      >
        {completed} réalisées
      </p>
    </div>
  );
}
