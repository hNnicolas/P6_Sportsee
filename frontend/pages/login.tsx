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
    <div className="flex flex-col lg:flex-row min-h-screen font-[var(--font-family-base)]">
      {/* Bloc formulaire */}
      <div className="flex-1 bg-[var(--color-background-light)] flex flex-col px-8 sm:px-16 pt-8 relative">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 animate-wave absolute bottom-4 right-4"
        />

        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white py-12 sm:py-16 px-6 sm:px-10 rounded-[var(--border-radius)] shadow-[var(--box-shadow)] w-full max-w-[420px] flex flex-col"
          >
            <h1 className="text-[var(--color-primary)] text-[1.8rem] font-bold leading-tight mb-6">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="text-black text-lg font-semibold mb-8">
              Se connecter
            </h2>

            <div className="w-full mb-6 flex justify-center">
              <div className="w-full max-w-[350px]">
                <label className="text-[1rem] font-medium mb-2 block text-[#5B5B5B]">
                  Adresse email
                </label>
                <input
                  type="text"
                  placeholder="Adresse email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-[#ccc] rounded-[10px] text-base text-[#5B5B5B] bg-white placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-[60px] px-4"
                />
              </div>
            </div>

            <div className="w-full mb-8 flex justify-center">
              <div className="w-full max-w-[350px]">
                <label className="text-[1rem] font-medium mb-2 block text-[#5B5B5B]">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#ccc] rounded-[10px] text-base text-[#5B5B5B] bg-white placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-[60px] px-4"
                />
              </div>
            </div>

            <div className="w-full flex justify-center mt-6 mb-6">
              <div className="w-full max-w-[350px]">
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white p-4 rounded-[10px] font-bold text-lg cursor-pointer transition-colors duration-300 hover:bg-[var(--color-primary-hover)]"
                >
                  Se connecter
                </button>
              </div>
            </div>

            <a href="#" className="text-[0.9rem] text-[#5B5B5B]">
              Mot de passe oublié ?
            </a>
          </form>
        </div>
      </div>

      {/* Bloc image */}
      <div className="flex-1 flex items-end justify-end hidden sm:flex lg:block">
        <Image
          src="/images/login.background.png"
          alt="Image de fond"
          width={1920}
          height={1080}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
