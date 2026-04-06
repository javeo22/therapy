import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div
      className="bg-surface-container rounded-3xl p-8"
      style={{ boxShadow: "var(--shadow-ambient)" }}
    >
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          Therapy
        </h1>
        <p className="text-on-surface-variant">Creá tu cuenta</p>
      </div>
      <RegisterForm />
    </div>
  );
}
