import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import useUserActivity from "../hooks/useUserActivity";
import { useAuth } from "../contexts/AuthContext";

const COLORS = ["#2f38dc", "#e8e8e8"];

function WeeklyDistanceChart({
  data,
}: {
  data: { week: string; km: number }[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Trier les semaines (ex : "S1", "S2", ...)
  const sortedWeeks = data
    .map((d) => d.week)
    .sort((a, b) => a.localeCompare(b));

  // Sélectionner 4 semaines consécutives à afficher
  let weeksOrder = sortedWeeks.slice(currentIndex, currentIndex + 4);

  // Compléter à 4 semaines si besoin (avec semaines fictives)
  while (weeksOrder.length < 4) {
    const lastWeek = weeksOrder.length
      ? weeksOrder[weeksOrder.length - 1]
      : sortedWeeks[sortedWeeks.length - 1] || "S0";
    const weekNum = parseInt(lastWeek.slice(1), 10);
    const nextWeekNum = weekNum + 1;
    weeksOrder.push(`S${nextWeekNum}`);
  }

  // Construire données à afficher, distance=0 si non trouvé
  const dataForChart = weeksOrder.map((week) => {
    const found = data.find((d) => d.week === week);
    return { week, km: found ? found.km : 0 };
  });

  const totalDistance = dataForChart.reduce((sum, entry) => sum + entry.km, 0);
  const averageDistance = totalDistance / dataForChart.length;

  // Navigation des semaines
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const handleNext = () => {
    if (currentIndex + 4 < sortedWeeks.length)
      setCurrentIndex(currentIndex + 1);
  };

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
      {/* Ligne moyenne + flèches */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 10,
          fontWeight: "bold",
          color: "#0B23F4",
          fontSize: 14,
        }}
      >
        <span>Moyenne km/semaine : {averageDistance.toFixed(2)}</span>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            cursor: currentIndex === 0 ? "default" : "pointer",
            border: "none",
            background: "transparent",
            color: "#666",
            fontSize: 18,
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (currentIndex > 0) e.currentTarget.style.color = "#0B23F4";
          }}
          onMouseLeave={(e) => {
            if (currentIndex > 0) e.currentTarget.style.color = "#666";
          }}
        >
          ←
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex + 4 >= sortedWeeks.length}
          style={{
            cursor:
              currentIndex + 4 >= sortedWeeks.length ? "default" : "pointer",
            border: "none",
            background: "transparent",
            color: "#666",
            fontSize: 18,
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (currentIndex + 4 < sortedWeeks.length)
              e.currentTarget.style.color = "#0B23F4";
          }}
          onMouseLeave={(e) => {
            if (currentIndex + 4 < sortedWeeks.length)
              e.currentTarget.style.color = "#666";
          }}
        >
          →
        </button>
      </div>

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
            tickSize={2}
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
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ marginRight: 10 }}
        >
          ←
        </button>
        <button
          onClick={handleNext}
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

function HeartRateChart({
  data,
}: {
  data: { day: string; min: number; max: number; avg: number }[];
}) {
  return (
    <div style={{ flex: 1, padding: 20, background: "#fff", borderRadius: 12 }}>
      <h4 style={{ marginBottom: 10, textAlign: "center" }}>
        Fréquence cardiaque moyenne
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis />
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
        </BarChart>
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

function WeeklyGoalDonut({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
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
            {goalData.map((entry, index) => (
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

export default function DashboardCharts() {
  const { token } = useAuth();

  const startWeek = "2025-01-02";
  const endWeek = "2029-12-29";

  const { sessions, isLoading, error } = useUserActivity(
    token,
    startWeek,
    endWeek
  );

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!sessions.length) return <p>Aucune donnée disponible</p>;

  // Construire distanceData (4 dernières semaines, format S1, S2, ...)
  const distanceData = sessions.slice(-4).map((session, idx) => ({
    week: `S${idx + 1}`,
    km: session.distance,
  }));

  // Trie les sessions par date croissante
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Jours de la semaine en français, correspondance getDay() (0=Dimanche)
  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Construire heartRateData (7 derniers jours) avec noms de jours exacts
  const heartRateData = sortedSessions.slice(-7).map((session) => {
    const date = new Date(session.date);
    const dayName = daysOfWeek[date.getDay()];
    return {
      day: dayName,
      min: session.heartRate.min,
      max: session.heartRate.max,
      avg: session.heartRate.average,
    };
  });

  const totalGoal = 6;
  const completedGoal = sessions.length;

  return (
    <div style={{ padding: "2rem", background: "#f6f7ff", minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <WeeklyDistanceChart data={distanceData} />
        <HeartRateChart data={heartRateData} />
      </div>
      <WeeklyGoalDonut completed={completedGoal} total={totalGoal} />
    </div>
  );
}
