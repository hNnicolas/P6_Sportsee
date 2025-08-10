import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/contexts/AuthContext";
import { UserProvider } from "../src/contexts/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AuthProvider>
  );
}
