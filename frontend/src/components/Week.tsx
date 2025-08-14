interface WeekProps {
  weekName: string;
  weekData: any; // tu peux préciser avec ton type exact
}

export default function Week({ weekName, weekData }: WeekProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{weekName}</h2>
      {weekData.map((day: any, index: number) => (
        <div key={index} className="mb-4 pl-4 border-l-2 border-gray-200">
          <p className="font-medium">Jour: {day.dayName}</p>
          {day.exercises.map((ex: any, i: number) => (
            <div key={i} className="ml-4 mb-2">
              <p>Type: {ex.type}</p>
              <p>Durée: {ex.duration}</p>
              <p>Intensité: {ex.intensity}</p>
              <p>Description: {ex.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
