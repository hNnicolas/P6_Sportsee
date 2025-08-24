const API_BASE_URL = "http://localhost:8000";

export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  profilePicture: string;
}

export interface UserStatistics {
  totalDistance: string;
  totalSessions: number;
  totalDuration: number;
}

export interface UserInfoResponse {
  profile: UserProfile;
  statistics: UserStatistics;
}

export interface RunningEntry {
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

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }
  return res.json(); // { token, userId }
}

export async function fetchUserInfo(token: string): Promise<UserInfoResponse> {
  const res = await fetch(`${API_BASE_URL}/api/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération des infos"
    );
  }
  return res.json();
}

export async function fetchUserActivity(
  token: string
): Promise<RunningEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/user-activity`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération de l'activité"
    );
  }

  const data = await res.json();
  return data.runningData; // <- car le backend retourne un objet { runningData: [...] }
}
