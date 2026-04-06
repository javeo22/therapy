"use client";

import { Stethoscope, User } from "lucide-react";

interface RoleSelectorProps {
  value: "therapist" | "patient";
  onChange: (role: "therapist" | "patient") => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <RoleOption
        selected={value === "therapist"}
        onClick={() => onChange("therapist")}
        icon={<Stethoscope size={24} />}
        label="Soy terapeuta"
      />
      <RoleOption
        selected={value === "patient"}
        onClick={() => onChange("patient")}
        icon={<User size={24} />}
        label="Soy paciente"
      />
    </div>
  );
}

function RoleOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl
        transition-all duration-300 ease-out
        ${
          selected
            ? "bg-primary/10 text-primary"
            : "bg-surface-container-highest text-on-surface-variant"
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
