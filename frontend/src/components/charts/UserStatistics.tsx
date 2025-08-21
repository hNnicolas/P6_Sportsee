import React from "react";

interface StatisticsProps {
  duration: number; // durée totale en minutes
  distance: number; // distance totale en km
}

export default function UserStatistics({
  duration,
  distance,
}: StatisticsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        width: "100%",
        maxWidth: "220px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Durée parcourue */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            color: "#0B23F4",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {Number(duration || 0).toFixed(1)}
        </span>
        <span
          style={{
            color: "#B6BDFC",
            fontSize: "0.875rem",
          }}
        >
          Minutes
        </span>
      </div>

      {/* Distance parcourue */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            color: "#F4320C",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {Number(distance || 0).toFixed(1)}
        </span>
        <span
          style={{
            color: "#FCC1B6",
            fontSize: "0.875rem",
          }}
        >
          Kilomètres
        </span>
      </div>
    </div>
  );
}
