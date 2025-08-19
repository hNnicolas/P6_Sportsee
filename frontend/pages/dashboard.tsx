import React from "react";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import useUserInfo from "@/src/hooks/useUserInfo";
import DashboardCharts from "@/src/components/DashboardCharts";
import TrainingFlow from "@/src/components/TrainingFlow";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const { data: userInfo, isLoading, error } = useUserInfo(token);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des données : {error}</p>;
  if (!userInfo) return <p>Aucun utilisateur trouvé.</p>;

  const { profile, statistics } = userInfo;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F2F3FF]">
      {/* Contenu principal */}
      <div className="max-w-[1700px] mx-auto p-8 flex-1">
        <div className="bg-white rounded-xl p-6">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="relative inline-block">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 animate-wave absolute bottom-4 right-4"
                />
              </div>
            </div>

            <div>
              <nav className="flex gap-4">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/chat">Coach AI</Link>
                <Link href="/profile">Mon profil</Link>
                <span className="text-[#0B23F4] text-xs font-thin">|</span>
                <button onClick={logout}>Se déconnecter</button>
              </nav>
            </div>
          </header>

          {/* Section profil */}
          <section className="flex flex-col gap-6">
            <div
              className="flex items-center justify-between w-[1200px] mx-auto rounded-xl p-4 overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, #FEFEFF, #F7F8FF)",
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
                  <p className="text-gray-600">
                    Membre depuis{" "}
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

          {/* Training Flow */}
          <div
            className="flex justify-center items-center rounded-xl shadow-md"
            style={{
              backgroundColor: "white",
              width: "1000px",
              height: "350px",
              margin: "0 auto",
              borderRadius: "50p",
            }}
          >
            <TrainingFlow
              onClose={() => console.log("Fermeture")}
              level="débutant"
              goal="perte de poids"
              availableDays={["lundi", "mercredi", "vendredi"]}
              age={25}
              weight={70}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="w-full py-4 px-8 text-sm text-[#111111]"
        style={{ backgroundColor: "#FFFFFF", marginTop: "100px" }}
      >
        <div className="max-w-[1500px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="font-semibold" style={{ marginLeft: "20px" }}>
            @Sportsee, Tous droits réservés
          </div>

          <div className="flex items-center" style={{ gap: "20px" }}>
            <Link
              href="/conditions"
              className="text-[#0B23F4] font-semibold hover:underline"
            >
              Conditions générales
            </Link>
            <Link
              href="/contact"
              className="text-[#0B23F4] font-semibold hover:underline"
            >
              Contact
            </Link>
            <img
              src="/images/logo-footer.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 animate-wave border-none outline-none"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
