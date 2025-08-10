import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { loginUser, getUserById } from "@/src/api/auth";

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const { token, userId } = await loginUser(username, password);
      const user = await getUserById(token);

      setToken(token);
      setUser(user);

      router.push("/profile");
    } catch (error) {
      alert("Erreur de connexion : " + (error as Error).message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
