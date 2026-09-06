"use client";

import { useState } from "react";

interface CampoSenhaProps {
  id: string;
  value: string;
  onChange: (valor: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  disabled?: boolean;
}

export default function CampoSenha(props: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="campo-senha">
      <input
        id={props.id}
        type={visivel ? "text" : "password"}
        className="campo"
        autoComplete={props.autoComplete}
        minLength={props.minLength}
        required
        disabled={props.disabled}
        value={props.value}
        onChange={(evento) => props.onChange(evento.target.value)}
      />
      <button
        type="button"
        className="campo-senha-controle"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        disabled={props.disabled}
        onClick={() => setVisivel((atual) => !atual)}
      >
        {visivel ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
