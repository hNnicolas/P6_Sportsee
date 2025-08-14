import { useState, useEffect } from "react";

interface Profile {
  firstName: string;
  lastName: string;
  age: number;
  gender: "female" | "male";
  height: number;
  weight: number;
  profilePicture: string;
  createdAt: string;
  level?: "débutant" | "intermédiaire" | "expert";
}

interface Statistics {
  totalDistance: number; 
  totalDuration: number; 
  totalSessions: number;
  caloriesBurned: number; 
  restDays: number;      
}

interface UserInfo {
  profile: Profile;
  statistics: Statistics;
}

const API_BASE_URL = "http://localhost:8000";

export default function useUserInfo(token: string | null) {
  const [data, setData] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setData(null);
      setError("Token manquant");
      return;
    }

    async function fetchUserInfo() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Erreur lors de la récupération des données");
        }

        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserInfo();
  }, [token]);

  return { data, isLoading, error };
}
