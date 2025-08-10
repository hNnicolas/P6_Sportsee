import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return <p>Redirection...</p>;
}
