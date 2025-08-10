import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, getUserById } from "@/src/api/auth";

interface User {
  id: string;
  username: string;
  // Ajoute d'autres champs si nécessaires
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      try {
        const foundUser = getUserById(storedUserId);
        setUser(foundUser);
      } catch {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { token, userId } = loginUser(username, password);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      const userData = getUserById(userId);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
