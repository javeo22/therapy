import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { giveConsent } from "@/lib/actions/consent";
import { Shield } from "lucide-react";

export default function ConsentimientoPage() {
  return (
    <div className="py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold text-on-surface">
            Consentimiento informado
          </h1>
          <p className="text-xs text-on-surface-variant">
            Ley 8968 — Protección de datos personales
          </p>
        </div>
      </div>

      <Card variant="elevated" className="mb-6">
        <div className="flex flex-col gap-4 text-sm text-on-surface-variant leading-relaxed">
          <p>
            Al usar esta aplicación, aceptás que tus datos personales y de salud
            sean procesados con las siguientes condiciones:
          </p>

          <div>
            <h3 className="font-semibold text-on-surface mb-1">
              Datos que recopilamos
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombre completo y correo electrónico</li>
              <li>
                Datos de sesiones terapéuticas (notas del terapeuta, métricas de
                seguimiento)
              </li>
              <li>Respuestas a autorregistros asignados por tu terapeuta</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-on-surface mb-1">
              Cómo usamos tus datos
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Para facilitar tu proceso terapéutico y el seguimiento por parte
                de tu terapeuta
              </li>
              <li>Para mostrar tu progreso en el panel de control</li>
              <li>Tus datos nunca serán compartidos con terceros</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-on-surface mb-1">
              Tus derechos
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Podés acceder, rectificar o eliminar tus datos en cualquier
                momento
              </li>
              <li>
                Podés exportar una copia de todos tus datos desde tu perfil
              </li>
              <li>
                Podés solicitar la eliminación completa de tu cuenta contactando
                a tu terapeuta
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-on-surface mb-1">
              Almacenamiento
            </h3>
            <p>
              Tus datos se almacenan de forma segura en servidores protegidos con
              cifrado. El acceso está restringido por políticas de seguridad a
              nivel de base de datos (RLS).
            </p>
          </div>
        </div>
      </Card>

      <form action={giveConsent}>
        <Button type="submit" className="w-full">
          Acepto y deseo continuar
        </Button>
      </form>

      <p className="text-[10px] text-on-surface-variant/60 text-center mt-4 leading-relaxed">
        Al presionar &quot;Acepto&quot;, confirmás que leíste y aceptás el
        tratamiento de tus datos personales conforme a la Ley 8968 de Costa
        Rica.
      </p>
    </div>
  );
}
