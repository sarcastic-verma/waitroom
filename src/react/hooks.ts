import React, { useEffect, useRef } from "react";
import { createLoadingInteraction, LoadingEngine } from "../core/engine";
import { InteractionConfig } from "../core/types";

export function useLoadingInteraction(
  ref: React.RefObject<HTMLElement>,
  config: InteractionConfig
) {
  const engineRef = useRef<LoadingEngine | null>(null);

  useEffect(() => {
    if (!ref.current || !config.isLoading) {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      return;
    }

    if (!engineRef.current) {
      engineRef.current = createLoadingInteraction(ref.current, config);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [config.isLoading, config.mode, ref]);

  return engineRef.current;
}
