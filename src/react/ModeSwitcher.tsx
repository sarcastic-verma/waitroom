import React, { useState } from "react";
import { InteractionMode } from "../core/types";

interface ModeSwitcherProps {
  modes: InteractionMode[];
  activeMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

const icons: Record<string, React.ReactNode> = {
  game: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h4m-2-2v4" />
      <line x1="15" y1="11" x2="15" y2="11" />
      <line x1="18" y1="13" x2="18" y2="13" />
    </svg>
  ),
  facts: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a6 6 0 0 1 6 6c0 2.97-1 3.5-2 4.5V15h-8v-2.5c-1-1-2-1.53-2-4.5a6 6 0 0 1 6-6z" />
      <path d="M8.5 18h7" />
      <path d="M10 21h4" />
    </svg>
  ),
  doodle: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  none: <span style={{ fontSize: 16 }}>✕</span>,
};

const tooltips: Record<string, string> = {
  game: "Play a Game",
  facts: "Learn Facts",
  doodle: "Draw Something",
  none: "Disable",
};

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  modes,
  activeMode,
  onModeChange,
}) => {
  const [hovered, setHovered] = useState<InteractionMode | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "4px",
      }}
    >
      {modes.map((mode) => (
        <div
          key={mode}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* Tooltip (Left side) */}
          {hovered === mode && (
            <div
              style={{
                position: "absolute",
                right: "100%",
                marginRight: "8px",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                opacity: 0,
                animation: "fadeIn 0.2s forwards",
              }}
            >
              {tooltips[mode] || mode}
            </div>
          )}

          {/* Icon Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onModeChange(mode);
            }}
            onMouseEnter={() => setHovered(mode)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              background:
                activeMode === mode ? "#333" : "rgba(255,255,255,0.9)",
              color: activeMode === mode ? "#fff" : "#555",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              transform: activeMode === mode ? "scale(1.1)" : "scale(1)",
            }}
            aria-label={mode}
          >
            {icons[mode] || mode[0].toUpperCase()}
          </button>

          <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(5px); }
                to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};
