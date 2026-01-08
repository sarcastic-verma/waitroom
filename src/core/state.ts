import { GameState, InteractionMode } from "./types";

const STORAGE_KEY_PREFIX = "waitroom_";

export class StateManager {
  private static instance: StateManager;

  private constructor() {}

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  // --- Game State ---

  getGameState(gameId: string): Partial<GameState> | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}game_${gameId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("Failed to load game state", e);
    }
    return null;
  }

  saveGameState(gameId: string, state: Partial<GameState>): void {
    try {
      // Simple debounce could be added here if needed, but for now direct write
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}game_${gameId}`,
        JSON.stringify(state)
      );
    } catch (e) {
      console.warn("Failed to save game state", e);
    }
  }

  // --- Mode Preference ---

  getPreferredMode(): InteractionMode | null {
    try {
      return localStorage.getItem(
        `${STORAGE_KEY_PREFIX}mode`
      ) as InteractionMode;
    } catch (e) {
      return null;
    }
  }

  savePreferredMode(mode: InteractionMode): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}mode`, mode);
    } catch (e) {
      console.warn("Failed to save preferred mode", e);
    }
  }
}

export const stateManager = StateManager.getInstance();
