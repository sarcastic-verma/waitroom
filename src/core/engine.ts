import { InteractionConfig, InteractionMode } from "./types";
import { stateManager } from "./state";

export class LoadingEngine {
  private config: InteractionConfig;
  private container: HTMLElement;
  private currentInstance: any = null;
  private activeMode: InteractionMode = "none";

  constructor(container: HTMLElement, config: InteractionConfig) {
    this.container = container;
    this.config = config;
  }

  init() {
    // Determine start mode
    let startMode = this.config.mode || "none";

    if (this.config.persistModePreference) {
      const saved = stateManager.getPreferredMode();
      if (saved && this.config.availableModes?.includes(saved)) {
        startMode = saved;
      }
    }

    this.setMode(startMode);
  }

  setMode(mode: InteractionMode) {
    if (this.activeMode === mode) return;

    // Cleanup previous
    if (this.currentInstance) {
      this.currentInstance.destroy();
      this.currentInstance = null;
    }

    this.activeMode = mode;

    // Simple fade transition
    this.container.style.opacity = "0";
    this.container.style.transition = `opacity ${
      this.config.transitionDuration || 300
    }ms ease-in-out`;

    setTimeout(() => {
      this.render();
      this.container.style.opacity = "1";
    }, (this.config.transitionDuration || 300) / 2);

    // Persist preference
    if (this.config.persistModePreference && mode !== "none") {
      stateManager.savePreferredMode(mode);
    }

    if (this.config.onModeChange) {
      this.config.onModeChange(mode);
    }
  }

  private render() {
    this.container.innerHTML = ""; // Clear container

    if (this.activeMode === "none") {
      return;
    }

    // Normally we would have a plugin registry or pass plugins in config.
    // For this lightweight version we rely on config having the specific plugin instances.

    // Render based on mode
    if (this.activeMode === "game" && this.config.game) {
      const gamePlugin = this.config.game;
      // Load state
      const savedState = stateManager.getGameState(gamePlugin.id) || {};
      this.currentInstance = gamePlugin.renderMini(this.container, savedState);
    } else if (this.activeMode === "facts" && this.config.facts) {
      const factsPlugin = this.config.facts;
      this.currentInstance = factsPlugin.renderMini(this.container);
    } else if (this.activeMode === "doodle" && this.config.doodle) {
      const doodlePlugin = this.config.doodle;
      this.currentInstance = doodlePlugin.renderMini(this.container);
    }
  }

  destroy() {
    if (this.currentInstance) {
      this.currentInstance.destroy();
    }
    this.container.innerHTML = "";
  }
}

export function createLoadingInteraction(
  container: HTMLElement,
  config: InteractionConfig
) {
  const engine = new LoadingEngine(container, config);
  engine.init();
  return engine;
}
