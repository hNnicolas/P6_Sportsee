import React from "react";
import { useAuth } from "../contexts/AuthContext";
import useUserActivity from "../hooks/useUserActivity";
import WeeklyDistanceChart from "./charts/WeeklyDistanceChart";
import HeartRateChart from "./charts/HeartRateChart";
import WeeklyGoalDonut from "./charts/WeeklyGoalDonut";

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

  const distanceData = sessions.slice(-4).map((session, idx) => ({
    week: `S${idx + 1}`,
    km: session.distance,
  }));

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
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
