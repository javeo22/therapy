import { PatientForm } from "@/components/therapist/patient-form";

export default function NuevoPacientePage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Nuevo paciente
      </h2>
      <PatientForm />
    </div>
  );
}
