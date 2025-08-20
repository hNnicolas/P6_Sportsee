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
              <nav className="flex items-center gap-1 text-sm mt-[20px] w-[400px] mr-[100px] h-16 px-4 whitespace-nowrap overflow-hidden">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/chat">Coach AI</Link>
                <Link href="/profile">Mon profil</Link>
                <span className="text-[#0B23F4] text-xs font-thin">|</span>
                <button onClick={logout}>Se déconnecter</button>
              </nav>
            </div>
          </header>

          {/* Div chatbot */}
          <div
            style={{
              marginTop: "60px",
              marginBottom: "30px",
              backgroundColor: "white",
              padding: "30px",
              width: "1000px",
              borderRadius: "20px",
            }}
            className="flex items-center justify-between mx-auto"
          >
            <div className="flex items-center gap-4">
              <img
                src="/assets/boticon.svg"
                alt="Chatbot Logo"
                className="h-10 w-10 sm:h-12 sm:w-12"
                style={{
                  filter:
                    "invert(20%) sepia(97%) saturate(6000%) hue-rotate(205deg) brightness(95%) contrast(100%)",
                }}
              />
              <span className="text-[#0B23F4] font-medium text-[18px]">
                Posez vos questions sur votre programme, vos performances, vos
                objectifs.
              </span>
            </div>
            <Link
              href="/chat"
              className="bg-[#0B23F4] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center no-underline inline-block w-[200px] h-[29px]"
            >
              Lancer une conversation
            </Link>
          </div>

          {/* Section profil */}
          <section className="flex flex-col gap-6">
            <div
              className="flex items-center justify-between w-[1060px] mx-auto p-4 overflow-hidden rounded-[20px]"
              style={{
                background: "linear-gradient(to bottom, #FEFEFF, #F7F8FF)",
              }}
            >
              <div className="flex items-center" style={{ margin: "35px" }}>
                <div className="w-[100px] h-[110px] rounded-[20px] overflow-hidden shadow-md flex-shrink-0 cursor-pointer relative group">
                  <img
                    src={profile.profilePicture}
                    alt="Profil"
                    className="w-full h-full object-cover object-right transition-transform duration-300 group-hover:scale-125"
                  />
                </div>
                <div className="ml-[20px] flex flex-col">
                  <h2
                    className="text-lg font-semibold mb-[0px]"
                    style={{ color: "#111111" }}
                  >
                    {`${profile.firstName} ${profile.lastName}`}
                  </h2>
                  <p className="text-sm" style={{ color: "#707070" }}>
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
                  <span className="bg-white text-[#FFFFFF] px-4 py-2 rounded font-semibold min-w-[60px] text-center inline-flex items-center gap-2 text-lg">
                    <img
                      src="/images/logo-chat.png"
                      alt="logo"
                      className="h-[1.8em] w-auto object-contain align-middle"
                    />
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
          <div style={{ marginTop: "20px", marginBottom: "50px" }}>
            <h2 className="text-[#111111] text-xl font-bold">
              Vos dernières performances
            </h2>

            <DashboardCharts />
          </div>

          {/* Training Flow */}
          <div
            className="flex justify-center items-start rounded-xl shadow-md w-full max-w-[1000px] mx-auto my-8 p-6"
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
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
            @Sportsee Tous droits réservés
          </div>

          <div className="flex items-center" style={{ gap: "20px" }}>
            <Link
              href="#"
              className="text-[#111111] font-semibold no-underline hover:text-[#0B23F4]"
            >
              Conditions générales
            </Link>
            <Link
              href="#"
              className="text-[#111111] font-semibold no-underline hover:text-[#0B23F4]"
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
