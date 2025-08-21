import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { loginUser, getUserById } from "@/src/api/auth";

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null
  );
  const [user, setUser] = useState<any | null>(null);

  // Récupération automatique des infos utilisateur si token présent
  useEffect(() => {
    if (!token) return;

    getUserById(token)
      .then((userData) => setUser(userData))
      .catch(() => {
        Cookies.remove("token");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const { token } = await loginUser(username, password);
      Cookies.set("token", token, { expires: 7 });
      setToken(token);

      const userData = await getUserById(token);
      setUser(userData);

      router.push("/profile");
    } catch (error) {
      console.error("Erreur login:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
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
