"use client";

import { useEffect, useState } from "react";

/** Relógio de Brasília. Renderiza vazio no servidor para não divergir na hidratação. */
export function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Sao_Paulo",
      }).format(new Date());
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular inline-block min-w-[8.5ch] font-mono text-[11px] text-subtle">
      {time && `${time} BRT`}
    </span>
  );
}
