import { useState, useEffect } from "react";
import TrainingPlanWindow from "../src/components/TrainingPlanWindow";
import useUserInfo from "../src/hooks/useUserInfo"; // Assure-toi que le chemin est correct

export default function TrainingPlanPage() {
  const [showWindow, setShowWindow] = useState(false);
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{
    age: number;
    weight: number;
  } | null>(null);

  const token = localStorage.getItem("token");
  const { data: userInfo, isLoading, error } = useUserInfo(token);

  // Met à jour le profil utilisateur dès que userInfo change
  useEffect(() => {
    if (userInfo) {
      console.log("Données reçues :", userInfo);
      setUserProfile({
        age: userInfo.profile.age,
        weight: userInfo.profile.weight,
      });
    }
  }, [userInfo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowWindow(true);
  };

  if (isLoading) return <p>Chargement du profil...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      {!showWindow && userProfile && (
        <form onSubmit={handleSubmit}>
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Niveau"
            required
          />
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Objectif"
            required
          />
          <select
            multiple
            value={availableDays}
            onChange={(e) =>
              setAvailableDays(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            required
          >
            <option value="lundi">Lundi</option>
            <option value="mardi">Mardi</option>
            <option value="mercredi">Mercredi</option>
            <option value="jeudi">Jeudi</option>
            <option value="vendredi">Vendredi</option>
          </select>

          <button type="submit">Générer le plan</button>
        </form>
      )}

      {showWindow && userProfile && (
        <TrainingPlanWindow
          onClose={() => setShowWindow(false)}
          level={level}
          goal={goal}
          availableDays={availableDays}
          age={userProfile.age}
          weight={userProfile.weight}
        />
      )}
    </div>
  );
}
