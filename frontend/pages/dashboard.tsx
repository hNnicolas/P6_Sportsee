import React from "react";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import useUserInfo from "@/src/hooks/useUserInfo";
import DashboardCharts from "@/src/components/DashboardCharts";

export default function DashboardPage() {
  const { token, logout } = useAuth();

  const { data: userInfo, isLoading, error } = useUserInfo(token);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des données : {error}</p>;
  if (!userInfo) return <p>Aucun utilisateur trouvé.</p>;

  const { profile, statistics } = userInfo;

  return (
    <div className="max-w-[1700px] mx-auto p-8 font-sans bg-[#F2F3FF]">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="relative inline-block">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-[120px] h-auto animate-[wave_1.5s_ease-in-out_infinite,pulse_3s_ease-in-out_infinite] origin-[70%_70%] z-10"
            />
          </div>
          <div className="font-bold text-xl text-[#0b23f4] ml-2 select-none">
            SPORTSEE
          </div>
        </div>

        <div>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/chat">Coach AI</Link>
            <Link href="/profile">Mon profil</Link>
            <span className="text-[#0B23F4] text-xs font-thin">|</span>
            <button onClick={logout}>Se déconnecter</button>
          </nav>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <div
          className="flex items-center justify-between w-[1200px] mx-auto rounded-xl p-4 overflow-hidden"
          style={{ background: "linear-gradient(to bottom, #FEFEFF, #F7F8FF)" }}
        >
          <div className="flex items-center">
            <div className="w-[100px] h-[100px] rounded-xl overflow-hidden shadow-md flex-shrink-0 cursor-pointer relative group">
              <img
                src={profile.profilePicture}
                alt="Profil"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-125"
              />
            </div>
            <div className="ml-4 flex flex-col">
              <h2 className="text-lg font-semibold">{`${profile.firstName} ${profile.lastName}`}</h2>
              <p className="text-gray-600">
                Membre depuis le{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-[#707070] font-medium whitespace-nowrap">
              Distance totale parcourue :
            </p>

            <div className="p-3 rounded-md bg-[#0B23F4] text-white">
              <span className="bg-white text-[#FFFFFF] px-3 py-1 rounded font-semibold min-w-[60px] text-center inline-block">
                {typeof statistics.totalDistance === "number"
                  ? statistics.totalDistance.toFixed(1)
                  : Number(statistics.totalDistance).toFixed(1)}
                km
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Graphiques */}
      <div className="mt-8">
        <DashboardCharts />
      </div>
    </div>
  );
}
