import type { NextApiRequest, NextApiResponse } from "next";
import { createEvents } from "ics";
import { DateTime } from "luxon";

// Convertir le nom du jour en index
const getDayIndex = (day: string) => {
  const days = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];
  return days.indexOf(day.toLowerCase());
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { trainingPlan, startDate, timezone } = req.body;
  if (!trainingPlan || !startDate || !timezone) {
    return res
      .status(400)
      .json({ error: "Missing trainingPlan, startDate or timezone" });
  }

  const events: any[] = [];

  trainingPlan.forEach((week: any, wIndex: number) => {
    week.days.forEach((day: any) => {
      if (day.session !== "repos") {
        // Créer la date en fonction du fuseau horaire de l'utilisateur
        const baseDate = DateTime.fromISO(startDate, { zone: timezone })
          .plus({ days: wIndex * 7 + getDayIndex(day.day) })
          .set({ hour: 18, minute: 0 });

        events.push({
          title: day.exercices[0]?.nom || "Entraînement",
          description: (day.session || "").substring(0, 50),
          start: [
            baseDate.year,
            baseDate.month,
            baseDate.day,
            baseDate.hour,
            baseDate.minute,
          ],
          duration: { minutes: parseInt(day.exercices[0]?.duree) || 30 },
          alarms: [
            { action: "display", trigger: { minutes: 30, before: true } },
          ],
        });
      }
    });
  });

  // Création de l'ICS
  const { error, value } = createEvents(events);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not generate calendar" });
  }

  // Retour du fichier ICS
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=planning-${new Date().toISOString()}.ics`
  );
  res.status(200).send(value);
}
