import { useState, useEffect } from "react";

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
  week: string;
  distance: number;
}

const API_BASE_URL = "http://localhost:8000";

// Helper : obtenir semaine ISO (ex : 2025-W32)
function getWeekISO(dateString: string): string {
  const date = new Date(dateString);
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tempDate.getUTCFullYear()}-W${weekNum.toString().padStart(2, "0")}`;
}

export default function useUserActivity(
  token: string | null,
  startWeek: string,
  endWeek: string
) {
  const [sessions, setSessions] = useState<RunningSession[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [weeklyDistances, setWeeklyDistances] = useState<WeeklyDistance[]>([]);
  const [averageDistance, setAverageDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !startWeek || !endWeek) return;

    async function fetchActivity() {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || "Erreur lors de la récupération");
        }

        const data = await res.json();
        const sessionsData: RunningSession[] = Array.isArray(data) ? data : [];

        setSessions(sessionsData);

        // Calcul distance totale
        const totalDist = sessionsData.reduce((sum, s) => sum + s.distance, 0);
        setTotalDistance(totalDist);

        // Calcul distance par semaine
        const distByWeekMap = sessionsData.reduce((acc: Record<string, number>, s) => {
          const week = getWeekISO(s.date);
          acc[week] = (acc[week] || 0) + s.distance;
          return acc;
        }, {});

        // Transformer en tableau trié par semaine croissante
        const weeklyDistsArray = Object.entries(distByWeekMap)
          .map(([week, distance]) => ({ week, distance }))
          .sort((a, b) => a.week.localeCompare(b.week));

        setWeeklyDistances(weeklyDistsArray);

        // Calcul moyenne hebdo (sur toutes les semaines retournées)
        const avgDist = weeklyDistsArray.length
          ? weeklyDistsArray.reduce((sum, w) => sum + w.distance, 0) / weeklyDistsArray.length
          : 0;

        setAverageDistance(avgDist);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setSessions([]);
        setTotalDistance(0);
        setWeeklyDistances([]);
        setAverageDistance(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
  }, [token, startWeek, endWeek]);

  return { sessions, totalDistance, weeklyDistances, averageDistance, isLoading, error };
}
