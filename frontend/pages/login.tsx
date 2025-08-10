import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    router.push("/profile");
  };

  return (
    <div className="flex h-screen font-[var(--font-family-base)]">
      <div className="flex-1 bg-[var(--color-background-light)] flex flex-col px-12 pt-12">
        <div className="flex items-center gap-3 mb-16 self-start">
          <img src="/logo.svg" alt="Logo" className="h-12 w-12 animate-wave" />
          <span className="font-bold text-[2rem] text-[var(--color-primary)]">
            SPORTSEE
          </span>
        </div>

        <div className="flex flex-col items-center flex-1 justify-center w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-white)] !bg-white py-12 px-10 rounded-[var(--border-radius)] shadow-[var(--box-shadow)] w-full max-w-[420px] flex flex-col"
          >
            <h1 className="text-[var(--color-primary)] text-[1.8rem] font-bold leading-tight mb-6">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="text-black text-lg font-semibold mb-8">
              Se connecter
            </h2>

            <div className="w-full mb-6">
              <label className="text-[1rem] font-medium mb-2 block text-[#5B5B5B]">
                Adresse email
              </label>
              <input
                type="text"
                placeholder="Adresse email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border border-[#ccc] rounded-[10px] text-base text-[#5B5B5B] bg-[var(--color-white)] placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="w-full mb-8">
              <label className="text-[1rem] font-medium mb-2 block text-[#5B5B5B]">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-[#ccc] rounded-[10px] text-base text-[#5B5B5B] bg-[var(--color-white)] placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white p-4 rounded-[10px] font-bold text-lg cursor-pointer transition-colors duration-300 hover:bg-[var(--color-primary-hover)] mb-6"
            >
              Se connecter
            </button>

            <a href="#" className="text-[0.9rem] text-[#5B5B5B]">
              Mot de passe oublié ?
            </a>
          </form>
        </div>
      </div>

      <div className="flex-1 relative">
        <Image
          src="/images/login.background.png"
          alt="Image de fond"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}
