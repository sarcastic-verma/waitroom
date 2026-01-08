# Product Requirements Document: Loading Games, Facts, and Doodles

## Executive Summary

**Product Name**: `waitroom` (npm package)  
**Vision**: Transform dead loading time into engaging micro-interactions through a lightweight, framework-agnostic NPM package that provides interactive games and content during loading states, with the ability to expand into full gaming experiences.

**Target Users**: Frontend developers building web applications with async operations (API calls, data fetching, heavy computations)

**Business Model**: Open-source freemium

- Free tier: Core package with 3-5 basic games
- Future paid tier: Premium games, cloud sync, analytics, white-label

---

## Problem Statement

Loading states in web applications represent dead time where users are disengaged. Current solutions (spinners, skeleton screens, progress bars) are passive and don't capitalize on user attention. Meanwhile:

- Users experience 10-50+ loading states per session
- Average loading time: 1-5 seconds per instance
- No existing solution provides interactive, stateful engagement during loading
- Developers rebuild basic loading interactions from scratch

---

## Goals & Success Metrics

### Primary Goals

1. Provide drop-in loading state replacement that increases user engagement
2. Create modular, framework-agnostic architecture
3. Maintain <10KB core bundle size
4. Achieve 1000+ weekly npm downloads within 6 months

### Success Metrics

- **Adoption**: Weekly npm downloads, GitHub stars
- **Engagement**: Average interaction rate (% of loading states where user engages)
- **Performance**: Zero impact on actual loading times
- **Developer Experience**: <5 minute integration time, <3 lines of code to implement

---

## Core Features (MVP - Phase 1)

### 1. Loading State Wrapper

**Description**: Component that wraps existing loading states and injects interactive content

**Requirements**:

- Detects loading state (boolean prop or promise)
- Configurable delay before showing interaction (default: 500ms)
- Smooth fade-in/fade-out transitions
- Non-intrusive UI that doesn't block underlying content
- TypeScript-first with full type definitions
- **Mode switching**: Support multiple interaction types (games, facts, doodle)
- **Mode selector UI**: Toggle between modes without leaving loading state
- **Mode persistence**: Remember user's preferred mode across sessions

**Technical Specs**:

```typescript
type InteractionMode = 'game' | 'facts' | 'doodle' | 'none';

interface LoadingInteractionConfig {
  isLoading: boolean;
  minDelay?: number; // ms before showing interaction
  
  // Mode configuration
  mode?: InteractionMode; // Default mode
  availableModes?: InteractionMode[]; // Which modes to enable
  showModeSwitcher?: boolean; // Show UI to switch modes
  persistModePreference?: boolean; // Save user's choice
  
  // Plugin configuration
  game?: GamePlugin; // Active when mode='game'
  facts?: FactsPlugin; // Active when mode='facts'
  doodle?: DoodlePlugin; // Active when mode='doodle'
  
  // Styling
  theme?: 'light' | 'dark' | 'custom';
  position?: 'center' | 'corner' | 'inline';
  
  // Callbacks
  onInteract?: () => void;
  onExpand?: () => void;
  onModeChange?: (mode: InteractionMode) => void;
}
```

### 2. State Persistence System

**Description**: Saves game progress across loading instances and browser sessions

**Requirements**:

- Support localStorage (default) and IndexedDB
- Automatic state hydration on component mount
- Debounced writes (max 1 write per 500ms)
- State versioning for future migrations
- Clear/reset functionality

**Data Structure**:

```typescript
interface GameState {
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
```

### 3. Expansion System

**Description**: Allows games to expand from loading area to full-screen modal

**Requirements**:

- "Expand" button appears after user interacts with game
- Smooth animation to full-screen overlay/modal
- Game state transfers seamlessly to expanded view
- Loading completion notification while game is expanded
- "Continue playing" or "Return to app" options
- ESC key and backdrop click to close
- Maintains responsive design

**User Flow**:

1. Loading starts → Mini-game appears after delay
2. User interacts → Expand button fades in
3. User clicks expand → Modal with full game
4. Loading completes → Toast notification appears
5. User can continue playing or dismiss

### 4. Game Plugin System

**Description**: Modular architecture for adding/removing games

**Requirements**:

- Simple plugin interface for game developers
- Each game is independently importable (tree-shakeable)
- Consistent API across all games
- Support for custom games
- Hot-swappable during development

**Plugin Interface**:

```typescript
interface GamePlugin {
  id: string;
  name: string;
  description: string;
  minLoadingTime?: number; // Recommended minimum
  
  // Render functions
  renderMini: (container: HTMLElement, state: GameState) => GameInstance;
  renderFull: (container: HTMLElement, state: GameState) => GameInstance;
  
  // Lifecycle
  onInteract?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onDestroy?: () => void;
  
  // Configuration
  config?: GameConfig;
}

interface GameInstance {
  getState: () => GameState;
  setState: (state: Partial<GameState>) => void;
  destroy: () => void;
}
```

### 5. Multi-Mode System (NEW)

**Description**: Support for different interaction types beyond games - facts and doodle modes

**Requirements**:

- Unified plugin architecture for all modes
- Smooth transitions when switching between modes
- Mode-specific state persistence
- Mode selector UI (tabs or dropdown)
- Keyboard shortcuts for switching (1=game, 2=facts, 3=doodle)
- Remember last used mode per user

**Mode Types**:

#### A. Games Mode (existing)

- Interactive games as defined in section 5
- Full expansion capability
- State persistence with scores/progress

#### B. Facts Mode

- Display rotating interesting facts, tips, or trivia
- Categories: tech tips, programming facts, keyboard shortcuts, did-you-know, industry stats
- Mini view: Single fact with rotation timer
- Full view: Fact gallery, search, favorites, categories
- User interactions: like/dislike, bookmark, share
- State: viewed facts, favorites, preferences

**Facts Plugin Interface**:

```typescript
interface FactsPlugin {
  id: string;
  name: string;
  category: string;
  
  // Data source
  facts: Fact[] | (() => Promise<Fact[]>);
  
  // Display options
  rotationInterval?: number; // ms between facts (default: 3000)
  showSource?: boolean;
  allowSearch?: boolean;
  
  // Render
  renderMini: (container: HTMLElement, config: FactsConfig) => FactsInstance;
  renderFull: (container: HTMLElement, config: FactsConfig) => FactsInstance;
}

interface Fact {
  id: string;
  text: string;
  category?: string;
  source?: string;
  url?: string; // Link to learn more
  tags?: string[];
}

interface FactsInstance {
  next: () => void; // Show next fact
  previous: () => void;
  favorite: (factId: string) => void;
  destroy: () => void;
}
```

#### C. Doodle Mode

- Simple drawing canvas for user creativity
- Mini view: Small canvas with basic tools (pen, eraser, clear)
- Full view: Larger canvas, more tools, colors, save/load
- Persists doodles across sessions
- State: saved doodles, brush settings, color preferences

**Doodle Plugin Interface**:

```typescript
interface DoodlePlugin {
  id: string;
  name: string;
  
  // Canvas options
  defaultBrushSize?: number;
  defaultColor?: string;
  enableColors?: boolean;
  enableBrushSizes?: boolean;
  
  // Features
  allowSave?: boolean;
  allowUndo?: boolean;
  maxUndoSteps?: number;
  
  // Render
  renderMini: (container: HTMLElement, config: DoodleConfig) => DoodleInstance;
  renderFull: (container: HTMLElement, config: DoodleConfig) => DoodleInstance;
}

interface DoodleInstance {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<string>; // Returns data URL
  load: (dataUrl: string) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  destroy: () => void;
}
```

**Mode Switcher UI Requirements**:

- Compact tab bar at top or bottom of interaction area
- Icons + labels for each mode
- Active mode highlighted
- Smooth transition animation when switching
- Keyboard shortcuts shown on hover
- Can be hidden if only one mode enabled

### 5. Initial Games (MVP)

#### Game 1: Click Counter

- **Concept**: Click as many times as possible before loading completes
- **Mini view**: Simple counter with click target
- **Full view**: Larger target, combo multipliers, visual effects
- **State**: Total clicks, high score, best combo

#### Game 2: Snake

- **Concept**: Classic snake game in minimal space
- **Mini view**: Tiny 8x8 grid, arrow key controls
- **Full view**: 16x16 grid, speed controls, obstacles
- **State**: High score, total food eaten, longest snake

#### Game 3: Memory Match

- **Concept**: Match pairs of cards
- **Mini view**: 4x2 grid (4 pairs)
- **Full view**: 6x4 grid (12 pairs), themes
- **State**: Best time, perfect matches, completion rate

### 6. Initial Facts Collections (MVP)

#### Collection 1: Developer Tips

- **Content**: VS Code shortcuts, terminal commands, Git tips, debugging tricks
- **Count**: 50+ facts
- **Example**: "Ctrl+Shift+P opens command palette in VS Code"
- **Rotation**: 4 seconds per fact

#### Collection 2: Programming Trivia

- **Content**: Language history, famous bugs, interesting algorithms
- **Count**: 50+ facts
- **Example**: "The first computer bug was an actual moth found in a relay"
- **Rotation**: 5 seconds per fact

#### Collection 3: Tech Stats

- **Content**: Industry statistics, performance benchmarks, usage data
- **Count**: 30+ facts
- **Example**: "JavaScript is used by 98% of all websites as of 2024"
- **Rotation**: 5 seconds per fact

### 7. Initial Doodle Implementation (MVP)

#### Basic Features

- **Canvas**: Responsive size (scales to container)
- **Tools**: Pen (3 sizes), eraser, clear button
- **Colors**: 8 preset colors (black, red, blue, green, yellow, purple, orange, white)
- **Persistence**: Auto-saves every 2 seconds to localStorage
- **Mini view**: 200x150px canvas, pen only
- **Full view**: 800x600px canvas, all tools and colors

---

## Technical Architecture

### Package Structure (Single Package)

```typescript
waitroom/
├── src/
│   ├── core/                 # Framework-agnostic core
│   │   ├── engine.ts        # Main loading interaction engine
│   │   ├── state.ts         # State persistence & hydration
│   │   ├── portal.ts        # Expansion/modal system
│   │   ├── mode-switcher.ts # Mode switching logic
│   │   ├── types.ts         # Shared TypeScript definitions
│   │   └── index.ts         # Core exports
│   │
│   ├── games/               # Game implementations
│   │   ├── click-counter.ts
│   │   ├── snake.ts
│   │   ├── memory.ts
│   │   └── index.ts         # Re-export all games
│   │
│   ├── facts/               # Facts collections
│   │   ├── dev-tips.ts
│   │   ├── programming-trivia.ts
│   │   ├── tech-stats.ts
│   │   └── index.ts         # Re-export all facts
│   │
│   ├── doodle/              # Doodle implementation
│   │   ├── basic-canvas.ts
│   │   └── index.ts         # Re-export doodle
│   │
│   ├── react/               # React wrapper & hooks
│   │   ├── LoadingInteraction.tsx
│   │   ├── ModeSwitcher.tsx
│   │   ├── Portal.tsx
│   │   ├── hooks.ts
│   │   └── index.ts         # Re-export React components
│   │
│   └── index.ts             # Main package entry point
│
├── examples/                # Demo applications (not bundled)
│   ├── react-demo/
│   ├── react-multi-mode/
│   └── vanilla-demo/
│
├── docs/                    # VitePress documentation
├── tsup.config.ts           # Build configuration
├── package.json             # Single package config
├── tsconfig.json            # TypeScript config
└── README.md
```

**Note**: Single src/ directory with all code. Each subdirectory has an index.ts for clean exports. No monorepo, no workspaces.

### Technology Stack

- **Build Tool**: tsup (multiple entry points for tree-shaking)
- **Package Manager**: npm (single package, no workspaces)
- **Language**: TypeScript 5.x (strict mode)
- **Testing**: Vitest + Testing Library
- **Documentation**: VitePress
- **CI/CD**: GitHub Actions (simplified single-package workflow)
- **Package Registry**: npm

### Build Configuration

- **Entry Points**: Multiple entry points in tsup.config.ts for tree-shaking
- **Formats**: ESM and CJS
- **TypeScript**: Generate .d.ts declaration files
- **Minification**: Enabled for production
- **External**: React/React-DOM marked as peer dependencies

### Bundle Size Targets

- Core package (with mode switching): <6KB gzipped
- Each game plugin: <3KB gzipped
- Each facts collection: <2KB gzipped
- Doodle plugin: <4KB gzipped
- React wrapper: <2KB gzipped
- Total (core + React + 1 mode active): <12KB gzipped

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

---

## API Design

### React Usage Example

```typescript
import { LoadingInteraction } from 'waitroom/react';
import { SnakeGame } from 'waitroom/games/snake';
import { DevTipsFacts } from 'waitroom/facts/dev-tips';
import { BasicDoodle } from 'waitroom/doodle/basic-canvas';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingInteraction
      isLoading={isLoading}
      mode="game"
      availableModes={['game', 'facts', 'doodle']}
      showModeSwitcher={true}
      persistModePreference={true}
      game={SnakeGame}
      facts={DevTipsFacts}
      doodle={BasicDoodle}
      minDelay={500}
      allowExpansion={true}
      theme="dark"
      position="center"
      onInteract={() => console.log('User engaged!')}
      onModeChange={(mode) => console.log('Switched to:', mode)}
    >
      <MyContent />
    </LoadingInteraction>
  );
}

// Single mode example (just facts)
function FactsOnlyComponent() {
  return (
    <LoadingInteraction
      isLoading={true}
      mode="facts"
      availableModes={['facts']}
      showModeSwitcher={false}
      facts={DevTipsFacts}
    >
      <MyContent />
    </LoadingInteraction>
  );
}
```

### Vanilla JS Usage

```typescript
import { createLoadingInteraction } from 'waitroom/core';
import { ClickCounterGame } from 'waitroom/games';
import { DevTipsFacts } from 'waitroom/facts';
import { BasicDoodle } from 'waitroom/doodle';

const interaction = createLoadingInteraction({
  container: document.getElementById('app'),
  
  // Mode configuration
  mode: 'game',
  availableModes: ['game', 'facts', 'doodle'],
  showModeSwitcher: true,
  
  // Plugins
  game: ClickCounterGame,
  facts: DevTipsFacts,
  doodle: BasicDoodle,
  
  config: {
    minDelay: 500,
    theme: 'light',
    persist: true
  },
  
  // Callbacks
  onModeChange: (mode) => console.log('Mode changed to:', mode)
});

// Start loading
interaction.show();

// Switch mode programmatically
interaction.setMode('facts');

// Stop loading
interaction.hide();

// Get current state
const state = interaction.getState();
const currentMode = interaction.getCurrentMode();
```

### Custom Game Creation

```typescript
import { defineGame, defineFacts, defineDoodle } from 'waitroom/core';

// Custom Game
export const MyCustomGame = defineGame({
  id: 'my-game',
  name: 'My Custom Game',
  
  renderMini(container, state) {
    container.innerHTML = '<div>Mini game</div>';
    return {
      getState: () => state,
      setState: (newState) => { /* update */ },
      destroy: () => { /* cleanup */ }
    };
  },
  
  renderFull(container, state) {
    container.innerHTML = '<div>Full game</div>';
    return {
      getState: () => state,
      setState: (newState) => { /* update */ },
      destroy: () => { /* cleanup */ }
    };
  }
});

// Custom Facts Collection
export const MyCustomFacts = defineFacts({
  id: 'my-facts',
  name: 'My Facts',
  category: 'custom',
  
  facts: [
    { id: '1', text: 'Fact 1', category: 'custom' },
    { id: '2', text: 'Fact 2', category: 'custom' }
  ],
  
  rotationInterval: 4000,
  
  renderMini(container, config) {
    // Render minimal fact display
    return {
      next: () => { /* show next */ },
      previous: () => { /* show prev */ },
      favorite: (id) => { /* save favorite */ },
      destroy: () => { /* cleanup */ }
    };
  },
  
  renderFull(container, config) {
    // Render full fact gallery
    return {
      next: () => { /* show next */ },
      previous: () => { /* show prev */ },
      favorite: (id) => { /* save favorite */ },
      destroy: () => { /* cleanup */ }
    };
  }
});

// Custom Doodle
export const MyCustomDoodle = defineDoodle({
  id: 'my-doodle',
  name: 'My Doodle',
  
  defaultBrushSize: 3,
  defaultColor: '#000000',
  
  renderMini(container, config) {
    // Render minimal canvas
    return {
      clear: () => { /* clear canvas */ },
      undo: () => { /* undo */ },
      redo: () => { /* redo */ },
      save: async () => '', // return data URL
      load: (url) => { /* load */ },
      setBrushColor: (color) => { /* set color */ },
      setBrushSize: (size) => { /* set size */ },
      destroy: () => { /* cleanup */ }
    };
  },
  
  renderFull(container, config) {
    // Render full canvas with tools
    return { /* same interface */ };
  }
});
```

---

## Installation & Setup

### Installation

```bash
npm install wait-play
# or
yarn add wait-play
# or
pnpm add wait-play
```

### Package Exports

The package provides multiple entry points for optimal tree-shaking:

```typescript
// Main entry (all features)
import * as WaitPlay from 'waitroom';

// Core only (no React, no games)
import { createLoadingInteraction } from 'waitroom/core';

// Individual games (tree-shaken)
import { SnakeGame } from 'waitroom/games/snake';
import { ClickCounterGame } from 'waitroom/games/click-counter';
import { MemoryGame } from 'waitroom/games/memory';

// Individual fact collections
import { DevTipsFacts } from 'waitroom/facts/dev-tips';
import { ProgrammingTrivia } from 'waitroom/facts/programming-trivia';
import { TechStats } from 'waitroom/facts/tech-stats';

// Doodle
import { BasicDoodle } from 'waitroom/doodle/basic-canvas';

// React components
import { LoadingInteraction, ModeSwitcher } from 'waitroom/react';
```

### Bundle Size by Import

- `waitroom` (full): ~12KB gzipped
- `waitroom/core`: ~6KB gzipped
- `waitroom/games/snake`: ~3KB gzipped
- `waitroom/facts/dev-tips`: ~2KB gzipped
- `waitroom/react`: ~2KB gzipped (+ core)

---

## User Experience Requirements

### Performance

- **Zero impact on actual loading time**: Games run in requestAnimationFrame, yield to main thread
- **Smooth 60fps animations**: Use CSS transforms and opacity only
- **Lazy loading**: Game code only loads when needed
- **Instant state restoration**: <50ms to hydrate state

### Accessibility

- **Keyboard navigation**: All games playable with keyboard
- **Screen reader support**: ARIA labels, announcements
- **Reduced motion**: Respect `prefers-reduced-motion`
- **Focus management**: Proper focus trapping in modal
- **Skip option**: Allow users to dismiss/disable games

### Visual Design

- **Non-intrusive**: Doesn't block or obscure content
- **Themed**: Matches parent application (light/dark)
- **Responsive**: Works on mobile, tablet, desktop
- **Smooth transitions**: Fade in/out, expand animations, mode switching
- **Loading indicator**: Always show traditional spinner as fallback
- **Mode switcher**: Compact tabs/pills UI that doesn't distract from content
- **Unified styling**: All modes feel cohesive within the same design system

---

## Non-Functional Requirements

### Developer Experience

- **Quick setup**: Install and integrate in <5 minutes
- **Single install**: `npm install waitroom` (no sub-packages)
- **Tree-shakeable imports**: Import only what you need
  - `waitroom/core` - Core only
  - `waitroom/games/snake` - Individual game
  - `waitroom/react` - React wrapper
- **Type safety**: Full TypeScript support with IntelliSense
- **Simple build**: Single `npm run build` command
- **Documentation**: Comprehensive docs with examples
- **Playground**: Online demo/sandbox for testing
- **Debugging**: Console warnings for misconfigurations

### Quality Assurance

- **Unit tests**: >80% coverage for core and games
- **Integration tests**: React wrapper tests (Vue in Phase 2)
- **Build tests**: Ensure all entry points build correctly
- **Bundle analysis**: Monitor size of each entry point
- **Visual regression tests**: Chromatic or similar
- **Performance tests**: Bundle size, runtime performance
- **Cross-browser testing**: BrowserStack or Playwright

### Maintenance

- **Semantic versioning**: Follow semver strictly
- **Changelog**: Automated with conventional commits
- **Deprecation policy**: 2 major versions warning period
- **Security**: Automated vulnerability scanning
- **License**: MIT (permissive open source)

---

## Phase 1 Deliverables (MVP)

### Week 1-2: Core Infrastructure

- [ ] TypeScript configuration (strict mode)
- [ ] Build pipeline with tsup
- [ ] Core loading interaction engine
- [ ] Mode switching system architecture
- [ ] State persistence system (localStorage)
- [ ] Basic portal/modal system
- [ ] Testing setup (Vitest)

### Week 3-4: Games, Facts & Doodle

- [ ] Click Counter game (mini + full)
- [ ] Snake game (mini + full)
- [ ] Memory Match game (mini + full)
- [ ] Developer Tips facts collection (50+ facts)
- [ ] Programming Trivia facts collection (50+ facts)
- [ ] Tech Stats facts collection (30+ facts)
- [ ] Basic Doodle canvas (mini + full)
- [ ] Facts rotation and display system
- [ ] Doodle canvas with pen, eraser, colors
- [ ] Plugin APIs finalized (game, facts, doodle)

### Week 5-6: Integration & Polish

- [ ] React wrapper component
- [ ] React hooks (useInteractionState, useModeSwitch)
- [ ] Mode switcher UI component
- [ ] Keyboard shortcuts (1/2/3 for mode switching)
- [ ] Mode preference persistence
- [ ] Smooth mode transition animations
- [ ] Documentation site (VitePress)
- [ ] Demo application (multi-mode showcase)
- [ ] Visual theming system
- [ ] Accessibility audit (all modes)
- [ ] Performance optimization
- [ ] npm package publishing
- [ ] GitHub repository setup
- [ ] README, CONTRIBUTING, LICENSE

---

## Future Enhancements (Phase 2+)

### Phase 2: Expansion (Month 2-3)

- Vue wrapper and composables
- Svelte wrapper
- 5 additional games (Tetris, Breakout, Whack-a-mole, Typing test, Reaction test)
- 3 additional fact collections (History facts, Science facts, Fun facts)
- Advanced doodle features (shapes, fill tool, layers)
- IndexedDB support for larger state
- Achievement system (cross-mode achievements)
- Daily challenges
- Fact search and filtering
- Doodle gallery (save multiple doodles)

### Phase 3: Premium Features (Month 4-6)

- Cloud state sync (Firebase/Supabase integration)
- Analytics dashboard for developers (mode usage, engagement by type)
- Leaderboards (global, team, friends) - games only
- Custom facts collection builder (CSV import)
- Advanced doodle tools (gradients, effects, stamps)
- Custom game builder (no-code)
- White-label licensing
- Advanced themes and animations
- Collaborative doodles (real-time multi-user)

### Phase 4: Ecosystem (Month 7+)

- Game marketplace for community games
- Facts marketplace (community-contributed collections)
- Doodle templates and stickers
- Revenue sharing with content creators
- In-app purchases for premium content
- Mobile SDK (React Native)
- WordPress plugin
- Shopify app
- AI-generated facts (personalized to user/context)
- AI doodle assistance (auto-complete drawings)

---

## Risks & Mitigations

### Risk 1: Performance Impact

**Risk**: Games cause jank or slow down loading  
**Mitigation**:

- Strict performance budgets
- RequestAnimationFrame with yielding
- Lazy loading
- Performance monitoring in CI

### Risk 2: Low Adoption

**Risk**: Developers don't see value  
**Mitigation**:

- Showcase demos with clear engagement metrics
- Make integration trivial (<5 minutes)
- Strong documentation and examples
- Community building (Discord, blog posts)

### Risk 3: Accessibility Complaints

**Risk**: Games not accessible to all users  
**Mitigation**:

- Accessibility-first design
- Keyboard navigation mandatory
- Screen reader testing
- Easy disable option
- Comprehensive a11y docs

### Risk 4: Bundle Size Bloat

**Risk**: Package becomes too large with multiple modes  
**Mitigation**:

- Strict bundle size CI checks (12KB total limit)
- Tree-shakeable architecture (each mode independently importable)
- Each game/fact collection/doodle is optional import
- Code splitting by default
- Regular bundle analysis
- Lazy load modes on-demand

### Risk 5: Mode Confusion

**Risk**: Users don't understand multiple modes or get overwhelmed  
**Mitigation**:

- Clear, intuitive mode icons and labels
- Tooltips explaining each mode on hover
- Smart defaults (single mode by default, opt-in to multi-mode)
- Onboarding hints on first use
- Mode preference persistence (user's choice remembered)

---

## Success Criteria

### Launch Success (Month 1)

- ✅ 100+ GitHub stars
- ✅ 500+ npm downloads
- ✅ 5+ community contributions (issues, PRs)
- ✅ Featured in 2+ newsletters/blogs
- ✅ <12KB full bundle size (all features)
- ✅ <6KB core-only bundle size
- ✅ Tree-shaking verified (importing single game = ~3KB)
- ✅ All 3 modes (games, facts, doodle) working in production

### 6-Month Success

- ✅ 1000+ weekly npm downloads
- ✅ 500+ GitHub stars
- ✅ 10+ community-contributed games
- ✅ 5+ community-contributed fact collections
- ✅ 3+ framework wrappers (React, Vue, Svelte)
- ✅ 95+ Lighthouse scores
- ✅ Mode usage analytics showing engagement across all types

### 12-Month Success

- ✅ 5000+ weekly npm downloads
- ✅ 2000+ GitHub stars
- ✅ Revenue from premium tier (if launched)
- ✅ Used by 10+ notable companies
- ✅ Conference talk/workshop delivered
- ✅ Community marketplace with 50+ custom content items (games, facts, doodle templates)

## Appendix

### Competitive Analysis

- **react-loading-skeleton**: Popular but no interactivity (100k+ weekly downloads)
- **nprogress**: Simple progress bar, no engagement (200k+ weekly downloads)
- **react-content-loader**: SVG placeholders, no games (50k+ weekly downloads)
- **None**: No existing solution provides interactive, stateful content with multiple engagement modes (games, facts, doodle)

### Research Insights

- Average web app has 15-30 loading states per user session
- Users are 3x more likely to wait when entertained (source: UX research studies)
- Micro-interactions increase perceived performance by 20-40%
- Mobile users have 2x longer loading times (network latency)
- **Different users prefer different engagement types**: Gamers want games, learners want facts, creative users want doodles
- **Mode flexibility increases adoption**: Offering choice increases package appeal to broader developer audience

### Target Keywords (SEO/Discovery)

- React loading spinner
- Interactive loading state
- Loading games
- Loading screen entertainment
- Async loading UI
- Loading state management
- Progress indicator alternatives
- **Loading facts display**
- **Loading screen doodle**
- **Multi-mode loading interaction**
- **Engaging loading experience**
