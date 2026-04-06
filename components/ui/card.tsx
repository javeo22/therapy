import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated";
}

export function Card({ children, variant = "default", className = "", style, ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-3xl p-6
        ${variant === "elevated" ? "bg-white" : "bg-surface-container"}
        ${className}
      `}
      style={{
        ...(variant === "elevated" ? { boxShadow: "var(--shadow-ambient)" } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
