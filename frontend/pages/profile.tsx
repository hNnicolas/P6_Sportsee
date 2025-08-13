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
    <div className="bg-[#F2F3FF] min-h-screen flex flex-col text-[#111111] font-sans">
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
            <a href="#">Coach AI</a>
            <Link href="/profile">Mon profil</Link>
            <span className="text-[#0B23F4] text-xs font-thin">|</span>
            <button onClick={logout}>Se déconnecter</button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto w-full p-8 flex gap-10 flex-1">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col w-[320px] flex-shrink-0 gap-8">
          <div className="flex items-center gap-4 bg-[var(--color-white)]">
            <div className="w-[140px] h-[160px] overflow-hidden rounded-md group p-4 rounded-md shadow-sm cursor-pointer flex-shrink-0">
              <img
                src={profile.profilePicture}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <p className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-[#707070] text-sm mt-1">
                Membre depuis le{" "}
                {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="text-center bg-[var(--color-white)] p-6 pb-16 w-[80%] mx-auto rounded-[var(--border-radius)] shadow-md mb-6 min-h-[250px]">
            <h2 className="text-lg font-semibold mb-2 text-[#111111]">
              Votre profil
            </h2>
            <hr className="border-[#E7E7E7] mb-4" />
            <ul className="text-[#707070] space-y-6">
              <li>Âge : {profile.age} ans</li>
              <li>Genre : {profile.gender === "female" ? "Femme" : "Homme"}</li>
              <li>Taille : {profile.height} cm</li>
              <li>Poids : {profile.weight} kg</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Vos statistiques</h2>
            <p className="text-sm text-[#707070]">
              Depuis le{" "}
              {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0B23F4] rounded-xl p-4 text-white">
              <p className="text-sm mb-1">Temps total couru</p>
              <p className="text-2xl font-semibold">
                {Math.floor(statistics.totalDuration / 60)}h{" "}
                {statistics.totalDuration % 60}min
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-4 text-white">
              <p className="text-sm mb-1">Calories brûlées</p>
              <p className="text-2xl font-semibold">
                {Math.round(caloriesBurned)} cal
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-4 text-white">
              <p className="text-sm mb-1">Distance totale parcourue</p>
              <p className="text-2xl font-semibold">
                {statistics.totalDistance} km
              </p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-4 text-white">
              <p className="text-sm mb-1">Nombre de jours de repos</p>
              <p className="text-2xl font-semibold">{restDays} jours</p>
            </div>
            <div className="bg-[#0B23F4] rounded-xl p-4 text-white col-span-2">
              <p className="text-sm mb-1">Nombre de sessions</p>
              <p className="text-2xl font-semibold">
                {statistics.totalSessions} sessions
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white w-full py-4 px-8 border-t border-gray-200 text-sm text-[#111111]">
        <div className="max-w-[1500px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="font-semibold">@Sportsee, Tous droits réservés</div>
          <div className="flex items-center gap-6">
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
            <img src="/logo.svg" alt="Logo Sportsee" className="w-8 h-8" />
          </div>
        </div>
      </footer>
    </div>
  );
}
