interface PatientGreetingProps {
  name: string;
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export function PatientGreeting({ name }: PatientGreetingProps) {
  const firstName = name.split(" ")[0];
  const greeting = getTimeOfDayGreeting();

  return (
    <div className="mb-6">
      <p className="text-sm text-on-surface-variant">{greeting}</p>
      <h2 className="font-serif text-2xl font-bold text-on-surface">
        Hola, {firstName}
      </h2>
    </div>
  );
}
