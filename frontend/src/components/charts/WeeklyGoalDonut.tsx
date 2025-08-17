import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface WeeklyGoalDonutProps {
  completed: number;
  total: number;
}

export default function WeeklyGoalDonut({
  completed,
  total,
}: WeeklyGoalDonutProps) {
  // S'assurer que completed ne dépasse pas total
  const validCompleted = Math.min(completed, total);

  const goalData = [
    { name: "Réalisées", value: validCompleted },
    { name: "Restantes", value: total - validCompleted },
  ];

  const COLORS = ["#0B23F4", "#B6BDFC"];

  return (
    <div
      style={{
        maxWidth: 800,
        height: 400,
        margin: "2rem auto",
        textAlign: "center",
        background: "#fff",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Objectifs réalisés */}
      <div style={{ textAlign: "left" }}>
        <p style={{ margin: "0.5rem 0", fontWeight: 600 }}>
          <span style={{ color: "#0B23F4", fontSize: "1.1rem" }}>
            x{validCompleted}
          </span>{" "}
          <span style={{ color: "#B6BDFC" }}>sur objectif de {total}</span>
        </p>
        <p style={{ fontSize: 12, color: "#666", marginTop: 0 }}>
          Courses hebdomadaires réalisées
        </p>
      </div>

      {/* Graphique camembert */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={goalData}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            label={({
              name,
              value,
              index,
            }: {
              name?: string;
              value?: number;
              index?: number;
            }) => {
              const color = index !== undefined ? COLORS[index] : "#000";
              return (
                <text
                  fill={color}
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {value} {name}
                </text>
              );
            }}
          >
            {goalData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Légende ou texte au centre du donut */}
      <p
        style={{
          marginTop: -130,
          fontSize: 16,
          fontWeight: "bold",
          color: "#0B23F4",
        }}
      >
        {validCompleted} réalisées
      </p>
    </div>
  );
}
