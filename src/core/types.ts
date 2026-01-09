export type InteractionMode = "game" | "facts" | "doodle" | "none";

export interface InteractionConfig {
  isLoading: boolean;
  minDelay?: number; // ms before showing interaction

  // Mode configuration
  mode?: InteractionMode; // Default mode
  availableModes?: InteractionMode[]; // Which modes to enable
  showModeSwitcher?: boolean; // Show UI to switch modes
  persistModePreference?: boolean; // Save user's choice

  // Styling
  theme?: "light" | "dark" | "custom";
  position?: "center" | "corner" | "inline";
  style?: Partial<CSSStyleDeclaration>; // Inline styles for container
  transitionDuration?: number; // ms for fade transition

  // Callbacks
  onInteract?: () => void;
  onExpand?: () => void;
  onModeChange?: (mode: InteractionMode) => void;

  // Plugins
  game?: GamePlugin;
  facts?: FactsPlugin;
  doodle?: DoodlePlugin;
}

export interface GameState {
  gameId: string;
  version: number;
  progress: {
    level: number;
    score: number;
    highScore: number;
    achievements: string[];
    totalPlayTime: number; // ms
  };
  meta: {
    firstPlayed: string; // ISO date
    lastPlayed: string;
    loadingInteractions: number;
    expansions: number;
  };
}

export interface GameInstance {
  getState: () => GameState;
  setState: (state: Partial<GameState>) => void;
  destroy: () => void;
}

export interface GamePlugin {
  id: string;
  name: string;
  description: string;
  minLoadingTime?: number; // Recommended minimum

  // Render functions
  renderMini: (
    container: HTMLElement,
    state: Partial<GameState>
  ) => GameInstance;
  renderFull: (
    container: HTMLElement,
    state: Partial<GameState>
  ) => GameInstance;

  // Lifecycle
  onInteract?: () => void;
}

export interface Fact {
  id: string;
  text: string;
  category?: string;
  source?: string;
  url?: string;
  tags?: string[];
}

export interface FactsConfig {
  rotationInterval?: number;
  showSource?: boolean;
  shuffle?: boolean;
}

export interface FactsInstance {
  next: () => void;
  previous: () => void;
  favorite: (factId: string) => void;
  destroy: () => void;
}

export interface FactsPlugin {
  id: string;
  name: string;
  category: string;

  facts: Fact[] | (() => Promise<Fact[]>);

  rotationInterval?: number;

  renderMini: (container: HTMLElement, config?: FactsConfig) => FactsInstance;
  renderFull: (container: HTMLElement, config?: FactsConfig) => FactsInstance;
}

export interface DoodleConfig {
  defaultBrushSize?: number;
  defaultColor?: string;
}

export interface DoodleInstance {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<string>; // Returns data URL
  load: (dataUrl: string) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  destroy: () => void;
}

export interface DoodlePlugin {
  id: string;
  name: string;

  defaultBrushSize?: number;
  defaultColor?: string;

  renderMini: (container: HTMLElement, config?: DoodleConfig) => DoodleInstance;
  renderFull: (container: HTMLElement, config?: DoodleConfig) => DoodleInstance;
}
