import React from "react";
import { InteractionMode } from "../core/types";

interface ModeSwitcherProps {
  modes: InteractionMode[];
  activeMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  modes,
  activeMode,
  onModeChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "10px",
        justifyContent: "center",
      }}
    >
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={(e) => {
            e.preventDefault();
            onModeChange(mode);
          }}
          style={{
            padding: "5px 10px",
            borderRadius: "15px",
            border: "none",
            background: activeMode === mode ? "#333" : "#eee",
            color: activeMode === mode ? "#fff" : "#333",
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};
