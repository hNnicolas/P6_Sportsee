import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import useUserInfo from "@/src/hooks/useUserInfo";
import DashboardCharts from "@/src/components/DashboardCharts";
import TrainingFlow from "@/src/components/TrainingFlow";
import ChatModal from "@/src/components/ChatModal";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const { data: userInfo, isLoading, error } = useUserInfo(token);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
                  src="/images/icons/logo.png"
                  alt="Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 animate-wave absolute bottom-4 right-4"
                />
              </div>
            </div>

            <div>
              <nav className="flex items-center gap-1 text-sm mt-[20px] w-full max-w-[500px]mr-[100px] h-16 px-4 whitespace-nowrap overflow-hidden">
                <Link
                  href="/dashboard"
                  style={{
                    color: "black",
                  }}
                  className="no-underline transition-colors"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0B23F4")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Dashboard
                </Link>

                <button
                  className="bg-[#111111] px-[15px] py-[15px] rounded-lg text-black hover:text-[#0B23F4] transition-colors"
                  onClick={() => setIsChatOpen(true)}
                >
                  Coach IA
                </button>
                <Link
                  href="/profile"
                  style={{ color: "black" }}
                  className="no-underline transition-colors"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0B23F4")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Mon profil
                </Link>
                <span className="text-[#0B23F4] text-xs font-thin">|</span>
                <button onClick={logout} className="text-[#0B23F4] !important">
                  Se déconnecter
                </button>
              </nav>
            </div>
          </header>

          {/* Div chatbot */}
          <div
            style={{
              marginTop: "100px",
              marginBottom: "30px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "20px",
              maxWidth: "950px",
            }}
            className="flex items-center justify-between mx-auto w-full max-w-[900px] overflow-hidden whitespace-nowrap"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src="/images/icons/icone-AI.png"
                alt="icon-ai"
                className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 mr-[10px]"
                style={{
                  filter:
                    "invert(20%) sepia(97%) saturate(6000%) hue-rotate(205deg) brightness(95%) contrast(100%)",
                }}
              />
              <span className="text-[#0B23F4] font-medium text-[18px] truncate">
                Posez vos questions sur votre programme, vos performances, vos
                objectifs.
              </span>
            </div>

            <Link
              href="/chat"
              style={{ width: "200px", padding: "20px" }}
              className="bg-[#0B23F4] text-white rounded-lg hover:bg-blue-700 transition 
                         text-center no-underline inline-block whitespace-nowrap flex-shrink-0 ml-4"
            >
              Lancer une conversation
            </Link>
          </div>

          {/* Section profil */}
          <section className="flex flex-col gap-6">
            <div
              className="flex items-center justify-between w-full max-w-[1000px] mx-auto p-4 overflow-hidden rounded-[20px]"
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

              <div className="flex items-center gap-3 mr-[25px]">
                <p className="text-[#707070] font-medium whitespace-nowrap">
                  Distance totale parcourue :
                </p>
                <div className="p-3 rounded-md bg-[#0B23F4] text-white">
                  <span className="bg-white text-[#FFFFFF] px-4 py-2 rounded font-semibold min-w-[60px] text-center inline-flex items-center gap-2 text-lg mr-[15px]">
                    <img
                      src="/images/icons/outline.png"
                      alt="logo"
                      className="h-[1.8em] w-auto object-contain align-middle"
                      style={{
                        fontSize: "18px",
                        width: "30px",
                        padding: "15px",
                      }}
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
          <div style={{ marginTop: "20px", marginBottom: "0px" }}>
            <h2
              className="text-[#111111] text-xl font-bold"
              style={{ marginLeft: "10px", marginTop: "100px" }}
            >
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
              src="/images/icons/footer-logo.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 animate-wave border-none outline-none"
            />
          </div>
        </div>
      </footer>
      {/* Affichage conditionnel de la modale */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
