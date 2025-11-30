"use client";

import React, { useEffect, useRef, useState } from "react"; import GoldNews from "./GoldNews";

/* ---------------------------------------------------
   SEMÁFORO DRAGGABLE (HORIZONTAL ARRIBA DERECHA)
----------------------------------------------------*/

function TrafficLight({ signal }: { signal: "long" | "short" | "neutral" }) {
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Colocar por defecto arriba a la derecha al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      // ancho aproximado del semáforo horizontal = 180
      setPosition({ x: w - 220, y: 24 });
    }
  }, []);

  // Eventos globales de drag
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      });
    }

    function handleUp() {
      setIsDragging(false);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const getColor = (light: string) => {
    if (signal === "long" && light === "green") return "#22c55e";
    if (signal === "short" && light === "red") return "#ef4444";
    if (signal === "neutral" && light === "neutral") return "#e5e7eb";
    return "rgba(255,255,255,0.15)";
  };

  const lightStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: "50%",
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        minWidth: 180,
        height: 60,
        background: "#0f172a",
        borderRadius: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "0 16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        zIndex: 50,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <div
        style={{
          ...lightStyle,
          background: getColor("green"),
        }}
      />

      <div
        style={{
          ...lightStyle,
          background: getColor("neutral"),
        }}
      />

      <div
        style={{
          ...lightStyle,
          background: getColor("red"),
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------
   HELPERS PRE-MARKET Y CIERRE
----------------------------------------------------*/

// Próxima apertura (pre-mercado): domingo 22:00 UTC
function getNextPreMarket(now: Date): Date {
  const target = new Date(now);
  const today = now.getUTCDay(); // 0=domingo
  const daysUntilSunday = (7 - today) % 7;

  target.setUTCDate(now.getUTCDate() + daysUntilSunday);
  target.setUTCHours(22, 0, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 7);
  }

  return target;
}

// Próximo cierre: viernes 21:00 UTC
function getNextClose(now: Date): Date {
  const target = new Date(now);
  const today = now.getUTCDay(); // 0=domingo, 5=viernes
  const daysUntilFriday = (5 - today + 7) % 7;

  target.setUTCDate(now.getUTCDate() + daysUntilFriday);
  target.setUTCHours(21, 0, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // si ya hemos pasado el cierre de este viernes, saltamos al siguiente
    target.setUTCDate(target.getUTCDate() + 7);
  }

  return target;
}

function formatDiff(target: Date, now: Date) {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "0h 0m";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

/* ---------------------------------------------------
   CONTADOR DINÁMICO (PRE ⟷ CLOSE)
----------------------------------------------------*/

function MarketCountdown() {
  const [label, setLabel] = useState<"Pre" | "Close">("Pre");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const nextPre = getNextPreMarket(now);
      const nextClose = getNextClose(now);

      // El siguiente evento del calendario semanal manda:
      // - Si lo próximo es la apertura (domingo 22h) => PRE
      // - Si lo próximo es el cierre (viernes 21h)  => CLOSE
      if (nextPre.getTime() < nextClose.getTime()) {
        setLabel("Pre");
        setTimeLeft(formatDiff(nextPre, now));
      } else {
        setLabel("Close");
        setTimeLeft(formatDiff(nextClose, now));
      }
    }

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 999,
        background: "#0f172a",
        color: "#e5e7eb",
        fontSize: 13,
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      }}
    >
      {timeLeft ? `${label}: ${timeLeft}` : `${label}: ...`}
    </div>
  );
}

/* ---------------------------------------------------
   PÁGINA PRINCIPAL (CHART EXACTO COMO TENÍAS)
----------------------------------------------------*/

export default function Home() {
  // De momento el semáforo está siempre "neutral";
  // luego aquí enchufaremos la lógica de scalping.
  const [signal] = useState<"long" | "short" | "neutral">("neutral");

  useEffect(() => {
    // Eliminamos scripts antiguos, por si recargas en caliente
    const existing = document.getElementById("tv-advanced-script");
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const script = document.createElement("script");
    script.id = "tv-advanced-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:XAUUSD", // mismo símbolo que usas en TradingView
      interval: "1", // 1 minuto por defecto
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "es",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      calendar: false,
      studies: [],
      support_host: "https://www.tradingview.com",
    });

    const container = document.getElementById("tv-advanced-container");
    if (container) {
      container.innerHTML = ""; // limpiamos
      container.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#f5f5f7",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Oro Bot
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#666",
          }}
        >
          XAUUSD — datos en tiempo real vía TradingView (OANDA:XAUUSD)
        </div>
      </header>

      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          background: "#fff",
          height: "75vh",
        }}
      >
        <div
          className="tradingview-widget-container"
          style={{ height: "100%", width: "100%" }}
        >
          <div
            id="tv-advanced-container"
            className="tradingview-widget-container__widget"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>

      {/* Contador fijo justo debajo del chart */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <MarketCountdown />
      </div>

      {/* Semáforo flotante y draggable (horizontal, arriba derecha por defecto) */}
      <TrafficLight signal={signal} />
    </div>
  );
}
