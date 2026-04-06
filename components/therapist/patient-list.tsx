"use client";

import { useState, useEffect, useTransition } from "react";
import { PatientCard } from "./patient-card";
import { listPatients } from "@/lib/actions/patients";
import type { PatientRecord } from "@/lib/types/database";
import { Search, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PatientWithStats extends PatientRecord {
  sessionCount?: number;
  lastSessionDate?: string | null;
}

interface PatientListProps {
  initialPatients: PatientWithStats[];
}

export function PatientList({ initialPatients }: PatientListProps) {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!search.trim()) {
      setPatients(initialPatients);
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const result = await listPatients(search);
        if (result.data) {
          setPatients(result.data);
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, initialPatients]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
          />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-highest focus:outline-none transition-colors"
          />
        </div>
        <Link href="/terapeuta/pacientes/nuevo">
          <Button size="sm" className="h-full">
            <Plus size={18} />
          </Button>
        </Link>
      </div>

      {/* List */}
      {patients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Users size={40} className="text-on-surface-variant/40" />
          <p className="text-on-surface-variant">
            {search
              ? "No se encontraron pacientes."
              : "Aún no tenés pacientes registrados."}
          </p>
          {!search && (
            <Link href="/terapeuta/pacientes/nuevo">
              <Button size="sm">Agregar paciente</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              sessionCount={patient.sessionCount}
              lastSessionDate={patient.lastSessionDate}
            />
          ))}
        </div>
      )}

      {isPending && (
        <div className="flex justify-center py-4">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
