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
    <div className="max-w-[1000px] mx-auto p-8 font-sans bg-[#f9f9f9]">
      {/* Header */}
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

        {/* Nav */}
        <nav className="flex items-center bg-white rounded-full px-6 py-2 text-sm font-medium text-black shadow-sm">
          <Link href="/dashboard" className="mr-4 hover:underline">
            Dashboard
          </Link>
          <a href="#" className="mr-4 hover:underline">
            Coach AI
          </a>
          <Link href="/profile" className="mr-4 hover:underline">
            Mon profil
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 border border-[#0b23f4] text-[#0b23f4] rounded-md hover:bg-blue-50 transition-colors"
          >
            Se déconnecter
          </button>
        </nav>
      </header>

      <section className="flex flex-col gap-6">
        <div
          className="flex items-center justify-between w-full rounded-xl"
          style={{
            background: "linear-gradient(90deg, #FEFEFF, #F6F7FF)",
          }}
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
              <p style={{ color: "#707070" }}>
                Membre depuis le{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="relative flex items-center max-w-xs">
            <p className="text-[#707070] font-medium whitespace-nowrap absolute left-0 -translate-x-full mr-2">
              Distance totale parcourue :
            </p>

            {/* Conteneur bleu pour la valeur */}
            <div className="p-3 rounded-md bg-[#0B23F4] text-white min-w-[80px] text-center">
              <span className="bg-white text-[#FFFFFF] px-3 py-1 rounded font-semibold inline-block">
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
