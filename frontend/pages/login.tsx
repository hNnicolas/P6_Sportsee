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
      <div className="flex-1 bg-[var(--color-background-light)] flex flex-col px-8 py-6">
        <div className="flex items-center gap-3 mb-8 self-start">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-10 animate-wave absolute"
            style={{ marginLeft: "90px", marginTop: "90px" }}
          />
        </div>

        <div className="flex flex-col items-center flex-1 justify-center w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-white)] !bg-white py-8 px-8 rounded-[var(--border-radius)] shadow-[var(--box-shadow)] w-full max-w-[380px] flex flex-col"
            style={{ height: "500px", width: "320px" }}
          >
            <h1 className="text-[var(--color-primary)] text-[1.5rem] font-bold leading-tight mb-5 ml-[20px]">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="text-black text-base mb-6 ml-[20px]">
              Se connecter
            </h2>

            <div className="w-full mb-5 flex justify-center">
              <div className="w-[90%]">
                <label className="text-[0.9rem] font-medium mb-2 block text-[#5B5B5B]">
                  Adresse email
                </label>
                <input
                  type="text"
                  placeholder="Adresse email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-[80%] max-w-[300px] border border-[#ccc] rounded-[10px] text-sm text-[#5B5B5B] bg-white placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    height: "50px",
                    padding: "0 14px",
                    backgroundColor: "white",
                  }}
                />
              </div>
            </div>

            <div className="w-full mb-[30px] flex justify-center">
              <div className="w-[90%]">
                <label className="text-[0.9rem] font-medium mb-2 block text-[#5B5B5B]">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[80%] max-w-[300px] border border-[#ccc] rounded-[10px] text-sm text-[#5B5B5B] bg-white placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    height: "50px",
                    padding: "0 14px",
                    backgroundColor: "white",
                    textAlign: "left",
                  }}
                />
              </div>
            </div>

            <div className="w-full flex justify-center mt-4 mb-5">
              <div className="w-[90%]">
                <button
                  type="submit"
                  className="bg-[var(--color-primary)] text-white rounded-[10px] font-bold text-base cursor-pointer transition-colors duration-300 hover:bg-[var(--color-primary-hover)]"
                  style={{ width: "260px", height: "50px" }}
                >
                  Se connecter
                </button>
              </div>
            </div>

            <a
              href="#"
              className="text-[0.8rem] text-[#5B5B5B] mt-[20px] ml-[10px] inline-block"
            >
              Mot de passe oublié ?
            </a>
          </form>
        </div>
      </div>

      <div className="flex-1 relative">
        <Image
          src="/images/login.background.png"
          alt="Image de fond"
          width={1024}
          height={768}
          style={{ width: "120%", height: "100%", objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}
