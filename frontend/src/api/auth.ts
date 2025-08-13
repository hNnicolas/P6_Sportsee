export const loginUser = async (username: string, password: string) => {
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Erreur lors de la connexion");
  }

  const data = await response.json();
  return data; 
};

export const getUserById = async (token: string) => {
  const response = await fetch("http://localhost:8000/api/user-info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Utilisateur non trouvé");
  }

  const user = await response.json();
  return user;
};


export const getUserActivity = async (
  token: string,
  startWeek: string,
  endWeek: string
) => {
  const response = await fetch(
    `http://localhost:8000/api/user-activity?startWeek=${encodeURIComponent(startWeek)}&endWeek=${encodeURIComponent(endWeek)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Impossible de récupérer l'activité utilisateur");
  }

  const sessions = await response.json();
  return sessions;
};

