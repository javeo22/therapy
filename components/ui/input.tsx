"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-surface-container-highest text-on-surface
            placeholder:text-on-surface-variant/50
            border-b-2 border-transparent
            focus:bg-white focus:border-primary/40
            focus:outline-none
            transition-all duration-300 ease-out
            ${error ? "border-error/60" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-error font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
