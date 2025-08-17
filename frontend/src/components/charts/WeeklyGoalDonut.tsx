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
        position: "relative",
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
            label={({ name, value, index }) => {
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

      {/* Réalisées en bas à gauche */}
      <span
        style={{
          position: "absolute",
          bottom: 180,
          left: 100,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: "bold",
          fontSize: 16,
          color: "#707070",
        }}
      >
        {/* Petit cercle bleu */}
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#0B23F4",
          }}
        ></span>
        {validCompleted} réalisées
      </span>

      {/* Restantes en haut à droite */}
      <span
        style={{
          position: "absolute",
          top: 80,
          right: 100,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: "bold",
          fontSize: 16,
          color: "#707070",
        }}
      >
        {/* Petit cercle bleu clair */}
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#B6BDFC",
          }}
        ></span>
        {total - validCompleted} restantes
      </span>
    </div>
  );
}
