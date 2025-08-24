import { useState, useEffect, useMemo } from "react";

// --- Interfaces pour typer les données ---
interface RunningSession {
  date: string;
  distance: number;
  duration: number;
  caloriesBurned: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
}

interface WeeklyDistance {
  week: string; // Identifiant de semaine au format ISO
  distance: number; // Distance totale parcourue sur cette semaine
}

interface WeeklyRemaining {
  week: string;
  remainingDistance: number; // Distance restante à faire pour atteindre l’objectif
  remainingSessions: number; // Séances restantes pour atteindre l’objectif
}

// Format de retour du hook
interface UserActivityHook {
  sessions: RunningSession[];
  totalDistance: number;
  weeklyDistances: WeeklyDistance[];
  averageDistance: number;
  weeklyRemaining: WeeklyRemaining[];
  isLoading: boolean;
  error: string | null;
}

const API_BASE_URL = "http://localhost:8000";

// --- Helper : calcul de la semaine ISO ---
function getWeekISO(dateString: string): string {
  const date = new Date(dateString);
  const dayNum = (date.getUTCDay() + 6) % 7; // lundi = 0
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const weekNum =
    1 + Math.round(((date.getTime() - yearStart.getTime()) / 86400000 - 3) / 7);
  return `${date.getUTCFullYear()}-W${weekNum.toString().padStart(2, "0")}`;
}

export default function useUserActivity(
  token: string | null,
  startWeek: string,
  endWeek: string,
  weeklyDistanceGoal: number = 40,
  weeklySessionsGoal: number = 8
): UserActivityHook {
  const [sessions, setSessions] = useState<RunningSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Chargement des données depuis l’API ---
  useEffect(() => {
    if (!token || !startWeek || !endWeek) return;

    const controller = new AbortController();

    async function fetchActivity() {
      setIsLoading(true);
      setError(null);

      try {
        // Appel API avec token et plage de semaines
        const res = await fetch(
          `${API_BASE_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || "Erreur lors de la récupération");
        }

        // Récupération et stockage des données
        const data: RunningSession[] = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Erreur inconnue");
          setSessions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
    return () => controller.abort();
  }, [token, startWeek, endWeek]);

  // --- Distances par semaine (calcul dérivé avec useMemo) ---
  const weeklyDistances = useMemo(() => {
    const distByWeek: Record<string, number> = {};

    // Regroupe les distances par semaine ISO
    sessions.forEach((s) => {
      const week = getWeekISO(s.date);
      distByWeek[week] = (distByWeek[week] || 0) + s.distance;
    });

    // Convertit en tableau et trie chronologiquement
    return Object.entries(distByWeek)
      .map(([week, distance]) => ({ week, distance }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [sessions]);

  // --- Distance totale sur toutes les sessions ---
  const totalDistance = useMemo(() => {
    return sessions
      .filter((s): s is RunningSession => typeof s.distance === "number")
      .reduce((sum, s) => sum + s.distance, 0);
  }, [sessions]);

  // --- Distance moyenne par semaine ---
  const averageDistance = useMemo(() => {
    if (!weeklyDistances.length) return 0;
    return (
      weeklyDistances.reduce((sum, w) => sum + w.distance, 0) /
      weeklyDistances.length
    );
  }, [weeklyDistances]);

  // --- Objectifs restants (distance et séances par semaine) ---
  const weeklyRemaining = useMemo(() => {
    const countsByWeek: Record<string, number> = {};

    // Compte le nombre de séances par semaine
    sessions.forEach((s) => {
      const week = getWeekISO(s.date);
      countsByWeek[week] = (countsByWeek[week] || 0) + 1;
    });

    // Regroupe toutes les semaines rencontrées (sessions + distances)
    const allWeeksSet = new Set([
      ...weeklyDistances.map((w) => w.week),
      ...Object.keys(countsByWeek),
    ]);

    // Pour chaque semaine, calcule ce qu’il reste à faire
    return Array.from(allWeeksSet)
      .sort()
      .map((week) => {
        const distanceDone =
          weeklyDistances.find((w) => w.week === week)?.distance || 0;
        const sessionsDone = countsByWeek[week] || 0;
        return {
          week,
          remainingDistance: Math.max(0, weeklyDistanceGoal - distanceDone),
          remainingSessions: Math.max(0, weeklySessionsGoal - sessionsDone),
        };
      });
  }, [sessions, weeklyDistances, weeklyDistanceGoal, weeklySessionsGoal]);

  // --- Données exposées par le hook ---
  return {
    sessions,
    totalDistance,
    weeklyDistances,
    averageDistance,
    weeklyRemaining,
    isLoading,
    error,
  };
}
