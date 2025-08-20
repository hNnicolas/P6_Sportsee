import React from "react";
import { useAuth } from "../contexts/AuthContext";
import useUserActivity from "../hooks/useUserActivity";
import WeeklyDistanceChart from "./charts/WeeklyDistanceChart";
import HeartRateChart from "./charts/HeartRateChart";
import WeeklyGoalDonut from "./charts/WeeklyGoalDonut";
import UserStatistics from "./charts/UserStatistics";

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

  // Données pour le graphique de distance
  const distanceData = sessions.slice(-4).map((session, idx) => ({
    week: `S${idx + 1}`,
    km: session.distance,
  }));

  // Données pour le graphique de fréquence cardiaque
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

  // Calcul des totaux pour UserStatistics
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  const totalGoal = 6;
  const completedGoal = sessions.length;

  return (
    <div
      style={{
        padding: "2rem",
        background: "#F2F3FF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Ligne 1 : Graphiques */}
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <WeeklyDistanceChart data={distanceData} />
        </div>
        <div style={{ flex: 1 }}>
          <HeartRateChart data={heartRateData} />
        </div>
      </div>

      {/* Ligne 2 : Donut + Stats */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Donut */}
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: 4, color: "#707070" }}>Cette semaine</h4>
          <p style={{ fontSize: 12, color: "#707070", marginTop: 0 }}>
            Du 23/06/2025 au 30/06/2025
          </p>
          <WeeklyGoalDonut completed={completedGoal} total={totalGoal} />
        </div>

        {/* Stats : distance et duration */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flex: 1,
            maxWidth: "800px",
            margin: "0 auto",
            height: "10px",
            marginTop: "90px",
          }}
        >
          {/* Durée */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "10px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 8px",
              textAlign: "left",
            }}
          >
            <p style={{ color: "#707070", fontWeight: "bold" }}>
              Durée d'activité
            </p>
            <p>
              <span style={{ color: "#0B23F4", fontWeight: "bold" }}>
                {totalDuration}
              </span>{" "}
              <span style={{ color: "#B6BDFC" }}>minutes</span>
            </p>
          </div>
          {/* Distance */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "10px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 8px",
              textAlign: "left",
            }}
          >
            <p style={{ color: "#707070", fontWeight: "bold" }}>Distance</p>
            <p>
              <span style={{ color: "#F4320C", fontWeight: "bold" }}>
                {totalDistance}
              </span>{" "}
              <span style={{ color: "#FCC1B6" }}>kilomètres</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
