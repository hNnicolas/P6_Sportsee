import { useState, useEffect } from "react";

// Informations personnelles de l'utilisateur
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

// Statistiques sportives de l'utilisateur
interface Statistics {
  totalDistance: number;
  totalDuration: number;
  totalSessions: number;
  caloriesBurned: number;
  restDays: number;
}

// Structure de la réponse complète de l'API
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

    // Fonction interne pour récupérer les infos utilisateur
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
          throw new Error(
            errorData?.message || "Erreur lors de la récupération des données"
          );
        }

        // Parsing JSON et mise à jour du state
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    // Exécution de la fonction
    fetchUserInfo();
  }, [token]);

  // Le hook retourne les données + états utiles
  return { data, isLoading, error };
}
