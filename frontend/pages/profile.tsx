import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/contexts/AuthContext";
import useUserInfo from "@/src/hooks/useUserInfo";
import useUserActivity from "@/src/hooks/useUserActivity";
import ChatModal from "@/src/components/ChatModal";

export default function ProfilePage() {
  const { token, logout, user } = useAuth();
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: userInfo, isLoading, error } = useUserInfo(token);

  const today = new Date();
  const startWeek = new Date(today);
  startWeek.setDate(today.getDate() - today.getDay());
  const endWeek = new Date(startWeek);
  endWeek.setDate(startWeek.getDate() + 6);

  const startWeekStr = startWeek.toISOString().slice(0, 10);
  const endWeekStr = endWeek.toISOString().slice(0, 10);

  const {
    sessions,
    isLoading: activityLoading,
    error: activityError,
  } = useUserActivity(token, startWeekStr, endWeekStr);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (isLoading || activityLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur utilisateur : {error}</p>;
  if (activityError) return <p>Erreur activité : {activityError}</p>;
  if (!userInfo) return <p>Aucune donnée utilisateur.</p>;

  const caloriesBurned =
    sessions?.reduce(
      (total, s) => total + (s.distance ? s.distance * 60 : 0),
      0
    ) ?? 0;

  const sessionDays = new Set(
    sessions?.map((s) => new Date(s.date).toDateString()) ?? []
  );
  const restDays = 7 - sessionDays.size;

  const { profile, statistics } = userInfo;

  return (
    <div className="bg-[#F2F3FF] h-screen flex flex-col text-[#111111] font-sans">
      <header className="flex justify-between items-center px-6 py-3 xl:px-8 xl:py-4">
        <div className="flex items-center">
          <div className="relative inline-block">
            <img
              alt="Logo"
              src="/images/logo.png"
              className="h-8 w-8 xl:h-10 xl:w-10 absolute bottom-4 animate-wave"
              style={{ left: "50px" }}
            />
          </div>
        </div>

        <div>
          <nav className="flex items-center gap-1 xl:gap-4 text-sm xl:text-base mt-[20px] w-[400px] xl:w-auto mr-[100px] xl:mr-8 h-16 px-4 whitespace-nowrap overflow-hidden">
            <Link
              href="/dashboard"
              style={{
                color: "black",
              }}
              className="no-underline transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B23F4")}
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
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B23F4")}
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

      <main className="max-w-[980px] xl:max-w-[1400px] mx-auto w-full px-4 xl:px-8 py-3 xl:py-6 flex gap-6 xl:gap-10 flex-1 overflow-hidden mt-[80px] xl:mt-16">
        <div className="bg-white rounded-xl shadow-md p-4 xl:p-6 flex flex-col w-[500px] xl:w-[400px] 2xl:w-[450px] flex-shrink-0 gap-4 xl:gap-6">
          <div className="flex items-center gap-3 xl:gap-4 bg-[var(--color-white)] rounded-[20px] w-[400px] xl:w-full ml-[20px] xl:ml-0">
            <div className="w-[100px] h-[100px] xl:w-[120px] xl:h-[140px] overflow-hidden group p-2 xl:p-4 shadow-sm cursor-pointer flex-shrink-0 m-[20px] xl:m-0 rounded-[20px]">
              <img
                src={profile.profilePicture}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-lg xl:text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-[#707070] text-xs xl:text-sm mt-1">
                Membre depuis le{" "}
                {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-left bg-[var(--color-white)] p-4 xl:p-6 w-[400px] xl:w-full h-[600px] xl:h-auto mt-[30px] xl:mt-0 ml-[20px] xl:ml-0 rounded-[20px] xl:rounded-[var(--border-radius)] shadow-md xl:pb-16">
            <h2 className="text-base xl:text-lg mb-2 xl:mb-4 text-[#111111] font-inter ml-[40px] xl:ml-0">
              Votre profil
            </h2>
            <hr className="border-[#E7E7E7] border-[0.5px] mb-3 xl:mb-4 w-[320px] xl:w-full" />
            <ul className="text-[#707070] text-sm xl:text-base list-none xl:space-y-6">
              <li style={{ marginBottom: "20px" }}>Âge : {profile.age} ans</li>
              <li style={{ marginBottom: "20px" }}>
                Genre : {profile.gender === "female" ? "Femme" : "Homme"}
              </li>
              <li style={{ marginBottom: "20px" }}>
                Taille : {profile.height} cm
              </li>
              <li style={{ marginBottom: "20px" }}>
                Poids : {profile.weight} kg
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 xl:gap-6 -ml-[50px] xl:ml-0">
          <div>
            <h2
              className="text-lg xl:text-xl font-semibold mb-1"
              style={{ marginLeft: "15px" }}
            >
              Vos statistiques
            </h2>
            <p
              className="text-[10px] xl:text-sm text-[#707070] whitespace-nowrap"
              style={{ marginLeft: "15px" }}
            >
              Depuis le{" "}
              {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:gap-4">
            <div className="bg-[#0B23F4] rounded-xl p-3 xl:p-4 text-white">
              <p className="text-xs xl:text-sm mb-1">Temps total couru</p>
              <p className="text-lg xl:text-2xl font-semibold">
                {Math.floor(statistics.totalDuration / 60)}h{" "}
                {statistics.totalDuration % 60}min
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 xl:p-4 text-white">
              <p className="text-xs xl:text-sm mb-1">Calories brûlées</p>
              <p className="text-lg xl:text-2xl font-semibold">
                {Math.round(caloriesBurned)} cal
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 xl:p-4 text-white">
              <p className="text-xs xl:text-sm mb-1">
                Distance totale parcourue
              </p>
              <p className="text-lg xl:text-2xl font-semibold">
                {statistics.totalDistance} km
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 xl:p-4 text-white">
              <p className="text-xs xl:text-sm mb-1">
                Nombre de jours de repos
              </p>
              <p className="text-lg xl:text-2xl font-semibold">
                {restDays} jours
              </p>
            </div>
            <div
              className="bg-[#0B23F4] rounded-xl p-3 xl:p-4 text-white col-span-2 xl:mr-0"
              style={{ marginRight: "273px" }}
            >
              <p className="text-xs xl:text-sm mb-1">Nombre de sessions</p>
              <p className="text-lg xl:text-2xl font-semibold">
                {statistics.totalSessions} sessions
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="w-full py-4 xl:py-4 px-8 xl:px-8 text-sm xl:text-sm text-[#111111]"
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
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
