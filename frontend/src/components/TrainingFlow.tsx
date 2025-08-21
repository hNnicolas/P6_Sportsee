import { useState } from "react";
import StartTraining from "./StartTraining";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import useUserPrompt, { UserProfile } from "../hooks/useUserPrompt";
import axios from "axios";

interface Props {
  onClose: () => void;
  level: string;
  goal: string;
  availableDays: string[];
  age?: number;
  weight?: number;
  recentRuns?: UserProfile["recentRuns"];
}

type Exercice = { nom: string; duree: string; repos: string };
type DayPlan = { day: string; session: string; exercices: Exercice[] };
type WeekPlan = { week: string; days: DayPlan[] };

export default function TrainingFlow({
  onClose,
  level,
  goal,
  availableDays,
  age,
  weight,
  recentRuns,
}: Props) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [trainingPlan, setTrainingPlan] = useState<WeekPlan[]>([]);
  const [localGoal, setLocalGoal] = useState(goal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openWeeks, setOpenWeeks] = useState<{ [key: number]: boolean }>({});

  // Hook qui génère un prompt adapté
  const prompt = useUserPrompt({
    level,
    age,
    weightKg: weight,
    goal: localGoal,
    recentRuns,
  });

  // Fonction pour aplatir le plan d'entrainement
  const flattenPlan = (plan: any): WeekPlan[] => {
    // Récupère le plan d'entrainement depuis l'objet
    const p = plan?.plan_entrainement;
    if (!p) return [];

    // Transforme chaque semaine en tableau de jours
    return Object.entries(p).map(([wKey, wValue]: any) => ({
      week: wKey,
      days: Object.entries(wValue).map(([dKey, dValue]: any) => ({
        day: dKey,
        session: dValue?.seance || "repos",
        exercices: dValue?.exercices || [],
      })),
    }));
  };

  // Fonction pour générer le planning via le backend
  const generateTrainingPlan = async () => {
    // 1. Vérification des champs obligatoires
    if (
      !localGoal ||
      !startDate ||
      !level ||
      !availableDays.length ||
      age == null ||
      weight == null
    ) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }
    setError("");
    setLoading(true);

    // 2. Préparation du payload à envoyer au backend
    const payload = {
      level: level.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      goal: localGoal,
      availableDays,
      age,
      weight,
      startDate,
      prompt: JSON.stringify(prompt),
    };

    try {
      // 3. Appel HTTP POST vers l'API
      const res = await axios.post("/api/training-plan/generate", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;
      console.log("JSON reçu :", data);
      // 4. Si le planning est présent dans la réponse
      if (data.plan) {
        setTrainingPlan(flattenPlan(data.plan)); // Transforme pour affichage
        setStep(4);
      } else {
        // 5. En cas de réponse sans plan
        setError("Le backend n'a pas renvoyé de planning.");
      }
    } catch (err) {
      setError("Erreur lors de la génération.");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (i: number) => {
    setOpenWeeks((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // Générer et télécharger un .ics en utilisant librairie ics
  const handleDownloadICS = async () => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await axios.post(
        "/api/training-plan/download-ics",
        { trainingPlan, startDate, timezone: userTimezone },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `planning-${new Date().toISOString()}.ics`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Erreur du téléchargement ICS");
    }
  };

  return (
    <div className="flex justify-center items-center w-full p-6">
      {/* Étape 1 */}
      {step === 1 && <StartTraining onStart={() => setStep(2)} />}

      {/* Étape 2 */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <FontAwesomeIcon
            icon={faBullseye}
            size="3x"
            className="text-[#0B23F4]"
          />
          <h2 className="text-xl font-semibold">
            Quel est votre objectif principal ?
          </h2>
          <div className="w-full flex justify-center">
            <div className="w-1/3 flex flex-col">
              <label className="mb-2 text-[#707070]">Objectif</label>
              <input
                type="text"
                value={localGoal}
                onChange={(e) => setLocalGoal(e.target.value)}
                className="w-full h-16 p-3 border rounded text-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0B23F4]"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(3)}
            className="px-6 py-2 bg-[#0B23F4] text-white rounded hover:bg-blue-700 transition"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white rounded-xl p-8 shadow-md">
          <FontAwesomeIcon
            icon={faCalendarDays}
            size="3x"
            className="text-[#0B23F4]"
          />
          <h2 className="text-xl font-semibold text-black">
            Quand souhaitez-vous commencer ?
          </h2>
          <div className="w-full flex justify-center">
            <div className="w-1/3 flex flex-col">
              <label className="mb-2 text-[#707070]">Date début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-16 p-3 border rounded text-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0B23F4]"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="w-12 h-8 flex items-center justify-center bg-gray-200 rounded-full"
            >
              ←
            </button>
            <button
              onClick={generateTrainingPlan}
              disabled={loading}
              className="px-6 py-2 bg-[#0B23F4] text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? "Génération..." : "Générer mon planning"}
            </button>
          </div>
        </div>
      )}

      {/* Étape 4 */}
      {step === 4 && (
        <div className="flex flex-col items-center w-full max-w-md bg-white rounded-xl p-8 shadow-md gap-6">
          <h2
            className="text-2xl font-semibold"
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            Votre planning de la semaine
          </h2>

          <span className="text-sm text-gray-500 mb-1">
            Important pour définir un programme adapté
          </span>

          {trainingPlan.map((week, wIndex) => (
            <div key={wIndex} className="w-full flex justify-center mb-6">
              <div
                className="w-[90%]"
                style={{
                  margin: "20px",
                  border: "1px solid #E7E7E7",
                  borderRadius: "8px",
                }}
              >
                {/* header semaine */}
                <div
                  onClick={() => toggleWeek(wIndex)}
                  className="p-4 flex justify-between items-center cursor-pointer"
                >
                  <h3
                    className="font-semibold capitalize text-gray-800"
                    style={{
                      marginLeft: "40px",
                      fontSize: "30px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {week.week.replace("_", " ")}
                  </h3>

                  <span
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#F2F3FF",
                      color: "#4657F7",
                      fontSize: "1.3rem",
                      marginRight: "40px",
                    }}
                  >
                    {openWeeks[wIndex] ? "−" : "+"}
                  </span>
                </div>

                {/* détails */}
                {openWeeks[wIndex] && (
                  <div
                    className="px-4 pb-4 space-y-4"
                    style={{ margin: "20px", marginBottom: "30px" }}
                  >
                    {week.days.map((day, dIndex) => (
                      <div
                        key={dIndex}
                        className="bg-white p-4"
                        style={{
                          margin: "20px",
                          border: "1px solid #717171",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          className="flex justify-between mb-2"
                          style={{ marginLeft: "20px" }}
                        >
                          <div>
                            <p
                              className="text-sm text-gray-400 capitalize"
                              style={{ marginLeft: "0px", marginBottom: "0px" }}
                            >
                              {day.day}
                            </p>

                            {/* mapping des exercices */}
                            {day.exercices.length === 0 ? (
                              <h4 className="font-semibold text-gray-800">
                                Repos
                              </h4>
                            ) : (
                              day.exercices.map((ex, eIndex) => (
                                <div
                                  key={eIndex}
                                  className="flex items-center mb-3"
                                  style={{ width: "750px" }}
                                >
                                  <div>
                                    <h4
                                      className="font-semibold text-gray-800"
                                      style={{
                                        fontSize: "22px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      {ex.nom}
                                    </h4>
                                    <div
                                      className="flex mb-1"
                                      style={{ color: "#707070", gap: "12px" }}
                                    >
                                      <p
                                        className="text-xs"
                                        style={{ marginTop: "-20px" }}
                                      >
                                        {day.session}
                                      </p>
                                      <p
                                        className="text-xs"
                                        style={{ marginTop: "-20px" }}
                                      >
                                        {ex.repos?.replace(" minutes", "min")}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className="text-xs px-2 py-1 rounded-full h-fit ml-auto mr-[25px]"
                                    style={{
                                      backgroundColor: "#F2F3FF",
                                      color: "#000000",
                                      borderRadius: "25px",
                                      width: "60px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginRight: "25px", // optionnel si tu veux laisser un petit espace du bord
                                    }}
                                  >
                                    {ex.duree?.replace(" minutes", "min")}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={handleDownloadICS}
              style={{
                padding: "20px 16px",
                minWidth: "200px",
                backgroundColor: "#0B23F4",
                color: "#fff",
                borderRadius: "12px",
                border: "2px solid transparent",
                outline: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0a1ecc")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0B23F4")
              }
            >
              Télécharger
            </button>

            <button
              onClick={generateTrainingPlan}
              style={{
                padding: "20px 40px",
                minWidth: "200px",
                backgroundColor: "#0B23F4",
                color: "#fff",
                borderRadius: "12px",
                border: "2px solid transparent",
                outline: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0a1ecc")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0B23F4")
              }
            >
              Régénérer un programme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
