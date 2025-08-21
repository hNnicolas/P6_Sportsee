import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface WeeklyGoalDonutProps {
  completed: number;
  total: number;
}

export default function WeeklyGoalDonut({
  completed = 7,
  total = 10,
}: WeeklyGoalDonutProps) {
  // S'assurer que completed ne dépasse pas total
  const validCompleted = Math.min(completed, total);

  const goalData = [
    { name: "Réalisées", value: validCompleted },
    { name: "Restantes", value: total - validCompleted },
  ];

  const COLORS = ["#0B23F4", "#B6BDFC"];

  const containerStyle = {
    maxWidth: "350px",
    width: "90%",
    minHeight: 350,
    margin: "2rem auto",
    textAlign: "center" as const,
    background: "#fff",
    borderRadius: 20,
    padding: "1.5rem",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    position: "relative" as const,
    marginLeft: "-30px",
  };

  const titleStyle = {
    textAlign: "left" as const,
    marginBottom: "1rem",
  };

  const completedTextStyle = {
    margin: "0.5rem 0",
    fontWeight: 600,
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
  };

  const subtitleStyle = {
    fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
    color: "#666",
    marginTop: 0,
  };

  const legendStyle = {
    position: "absolute" as const,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: "bold",
    fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
    color: "#707070",
  };

  const circleStyle = {
    display: "inline-block",
    width: "clamp(10px, 1.2vw, 14px)",
    height: "clamp(10px, 1.2vw, 14px)",
    borderRadius: "50%",
  };

  // Calcul dynamique des positions basé sur la taille de l'écran
  const getResponsivePositions = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1400) {
        return {
          completed: { bottom: "45%", left: "15%" },
          remaining: { top: "25%", right: "15%" },
        };
      } else if (width >= 1024) {
        return {
          completed: { bottom: "45%", left: "12%" },
          remaining: { top: "25%", right: "12%" },
        };
      }
    }
    return {
      completed: { bottom: "45%", left: "10%" },
      remaining: { top: "25%", right: "10%" },
    };
  };

  const positions = getResponsivePositions();

  return (
    <>
      <style>
        {`
          @media (max-width: 1023px) {
            .weekly-goal-container {
              max-width: 90% !important;
              padding: 1rem !important;
            }
            .legend-item {
              position: static !important;
              margin: 0.5rem 0 !important;
              justify-content: center !important;
            }
            .legends-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 1rem;
            }
          }
          
          @media (min-width: 1024px) and (max-width: 1199px) {
            .weekly-goal-container {
              max-width: 700px !important;
            }
          }
          
          @media (min-width: 1200px) {
            .weekly-goal-container {
              max-width: 800px !important;
            }
          }
        `}
      </style>
      <div className="weekly-goal-container" style={containerStyle}>
        {/* Objectifs réalisés */}
        <div style={titleStyle}>
          <p style={completedTextStyle}>
            <span style={{ color: "#0B23F4", fontSize: "1.1em" }}>
              x{validCompleted}
            </span>{" "}
            <span style={{ color: "#B6BDFC" }}>sur objectif de {total}</span>
          </p>
          <p style={subtitleStyle}>Courses hebdomadaires réalisées</p>
        </div>

        {/* Graphique camembert */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={goalData}
              dataKey="value"
              innerRadius="30%"
              outerRadius="45%"
              startAngle={90}
              endAngle={-270}
              label={({ name, value, index }) => {
                const color = index !== undefined ? COLORS[index] : "#000";
                return (
                  <text
                    fill={color}
                    fontSize="clamp(12px, 1.5vw, 16px)"
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

        {/* Version desktop - légendes positionnées absolument */}
        <div className="desktop-legends" style={{ display: "block" }}>
          {/* Réalisées en bas à gauche */}
          <span
            className="legend-item"
            style={{
              ...legendStyle,
              bottom: positions.completed.bottom,
              left: positions.completed.left,
            }}
          >
            <span
              style={{
                ...circleStyle,
                backgroundColor: "#0B23F4",
              }}
            ></span>
            {validCompleted} réalisées
          </span>

          {/* Restantes en haut à droite */}
          <span
            className="legend-item"
            style={{
              ...legendStyle,
              top: positions.remaining.top,
              right: positions.remaining.right,
            }}
          >
            <span
              style={{
                ...circleStyle,
                backgroundColor: "#B6BDFC",
              }}
            ></span>
            {total - validCompleted} restantes
          </span>
        </div>

        {/* Version mobile - légendes centrées */}
        <div className="legends-container" style={{ display: "none" }}>
          <div
            className="legend-item"
            style={{ ...legendStyle, position: "static", margin: "0.5rem 0" }}
          >
            <span style={{ ...circleStyle, backgroundColor: "#0B23F4" }}></span>
            {validCompleted} réalisées
          </div>
          <div
            className="legend-item"
            style={{ ...legendStyle, position: "static", margin: "0.5rem 0" }}
          >
            <span style={{ ...circleStyle, backgroundColor: "#B6BDFC" }}></span>
            {total - validCompleted} restantes
          </div>
        </div>
      </div>
    </>
  );
}
