import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/contexts/AuthContext";
import useUserInfo from "@/src/hooks/useUserInfo";
import useUserActivity from "@/src/hooks/useUserActivity";

export default function ProfilePage() {
  const { token, logout, user } = useAuth();
  const router = useRouter();

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
    if (!user) router.replace("/login");
  }, [user, router]);

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
      <header className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center">
          <div className="relative inline-block">
            <img
              alt="Logo"
              src="/images/logo.png"
              className="h-8 w-8 absolute bottom-4 animate-wave"
              style={{ left: "50px" }}
            />
          </div>
        </div>

        <div>
          <nav className="flex items-center gap-1 text-sm mt-[20px] w-[400px] mr-[100px] h-16 px-4 whitespace-nowrap overflow-hidden">
            <Link
              href="/dashboard"
              className="text-[#111111] hover:text-[#0B23F4]"
            >
              Dashboard
            </Link>
            <Link href="/chat" className="text-[#111111] hover:text-[#0B23F4]">
              Coach AI
            </Link>
            <Link
              href="/profile"
              className="text-[#111111] hover:text-[#0B23F4]"
            >
              Mon profil
            </Link>
            <span className="text-[#0B23F4] text-xs font-thin">|</span>
            <button
              onClick={logout}
              className="text-[#111111] hover:text-[#0B23F4] py-1 px-2"
            >
              Se déconnecter
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[980px] mx-auto w-full px-4 py-3 flex gap-6 flex-1 overflow-hidden mt-[80px]">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col w-[500px] flex-shrink-0 gap-4">
          <div className="flex items-center gap-3 bg-[var(--color-white)] rounded-[20px] w-[380px] ml-[20px]">
            <div className="w-[100px] h-[100px] overflow-hidden group p-2 shadow-sm cursor-pointer flex-shrink-0 m-[20px] rounded-[20px]">
              <img
                src={profile.profilePicture}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-[#707070] text-xs mt-1">
                Membre depuis le{" "}
                {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-left bg-[var(--color-white)] p-4 w-[370px] h-[600px] mt-[30px] ml-[20px] rounded-[20px] shadow-md">
            <h2 className="text-base mb-2 text-[#111111] font-inter ml-[40px]">
              Votre profil
            </h2>
            <hr className="border-[#E7E7E7] border-[0.5px] mb-3 w-[320px]" />
            <ul className="text-[#707070] text-sm list-none">
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

        <div className="flex-1 flex flex-col gap-2 -ml-[50px]">
          <div>
            <h2
              className="text-lg font-semibold mb-1"
              style={{ marginLeft: "15px" }}
            >
              Vos statistiques
            </h2>
            <p
              className="text-[10px] text-[#707070] whitespace-nowrap"
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

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B23F4] rounded-xl p-3 text-white">
              <p className="text-xs mb-1">Temps total couru</p>
              <p className="text-lg font-semibold">
                {Math.floor(statistics.totalDuration / 60)}h{" "}
                {statistics.totalDuration % 60}min
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 text-white">
              <p className="text-xs mb-1">Calories brûlées</p>
              <p className="text-lg font-semibold">
                {Math.round(caloriesBurned)} cal
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 text-white">
              <p className="text-xs mb-1">Distance totale parcourue</p>
              <p className="text-lg font-semibold">
                {statistics.totalDistance} km
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-3 text-white">
              <p className="text-xs mb-1">Nombre de jours de repos</p>
              <p className="text-lg font-semibold">{restDays} jours</p>
            </div>
            <div
              className="bg-[#0B23F4] rounded-xl p-3 text-white col-span-2"
              style={{ marginRight: "273px" }}
            >
              <p className="text-xs mb-1">Nombre de sessions</p>
              <p className="text-lg font-semibold">
                {statistics.totalSessions} sessions
              </p>
            </div>
          </div>
        </div>
      </main>

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
