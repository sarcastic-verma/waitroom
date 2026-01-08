import React, { useRef, useState, useEffect } from "react";
import { InteractionConfig, InteractionMode } from "../core/types";
import { useLoadingInteraction } from "./hooks";
import { ModeSwitcher } from "./ModeSwitcher";

export interface LoadingInteractionProps
  extends Omit<InteractionConfig, "isLoading"> {
  isLoading: boolean;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  style?: Partial<CSSStyleDeclaration>;
  transitionDuration?: number;
}

export const LoadingInteraction: React.FC<LoadingInteractionProps> = (
  props
) => {
  const {
    isLoading,
    children,
    availableModes = ["game", "facts", "doodle"],
    showModeSwitcher = true,
    width = "100%",
    height = "300px",
    ...config
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<InteractionMode>(
    props.mode || availableModes[0] || "none"
  );

  // Sync mode prop if changed externally
  useEffect(() => {
    if (props.mode) setCurrentMode(props.mode);
  }, [props.mode]);

  const activeConfig = {
    ...config,
    isLoading,
    mode: currentMode,
    availableModes,
    style: props.style,
    transitionDuration: props.transitionDuration,
  };

  useLoadingInteraction(containerRef, activeConfig);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: "relative", width, height }}>
      {showModeSwitcher && availableModes.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            zIndex: 10,
          }}
        >
          <ModeSwitcher
            modes={availableModes}
            activeMode={currentMode}
            onModeChange={setCurrentMode}
          />
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};
