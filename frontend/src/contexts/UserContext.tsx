import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import useUserInfo from "@/src/hooks/useUserInfo";
import { useAuth } from "./AuthContext";

interface UserContextType {
  profile: any | null;
  statistics: any | null;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const { data, isLoading, error } = useUserInfo(token);

  return (
    <UserContext.Provider
      value={{
        profile: data?.profile ?? null,
        statistics: data?.statistics ?? null,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
