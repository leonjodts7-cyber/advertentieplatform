"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function ToggleSwitch({
  id,
  label,
  checked,
  onChange,
  className,
}: ToggleSwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn("toggle-switch", className)}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-switch__input sr-only"
      />
      <span
        className={cn("toggle-switch__track", checked && "toggle-switch__track--on")}
        aria-hidden
      >
        <span className="toggle-switch__thumb" />
      </span>
      <span className="toggle-switch__label">{label}</span>
    </label>
  );
}
