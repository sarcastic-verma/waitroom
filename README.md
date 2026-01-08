# waitroom

Transform dead loading time into engaging micro-interactions.

## Installation

```bash
npm install waitroom
# or
yarn add waitroom
# or
pnpm add waitroom
```

## Quick Start (React)

```tsx
import { useState } from 'react';
import { LoadingInteraction } from 'waitroom';
import { SnakeGame } from 'waitroom/games/snake';
import { DevTipsFacts } from 'waitroom/facts/dev-tips';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingInteraction
      isLoading={isLoading}
      availableModes={['game', 'facts']}
      game={SnakeGame}
      facts={DevTipsFacts}
    >
        <YourContent />
    </LoadingInteraction>
  );
}
```

## Examples

### React Demo
A comprehensive React example is available in `examples/react-demo`.

To run it:
1. `npm run build` (in root)
2. `cd examples/react-demo`
3. `npm install`
4. `npm run dev`

This demo showcases:
- All interaction modes (Game, Facts, Doodle)
- Mode switching
- Custom themes
- Full-screen expansion capability

## Architecture
The package is designed for tree-shaking:
- `waitroom/core`: Framework-agnostic engine
- `waitroom/games/*`: Individual games
- `waitroom/facts/*`: Individual fact collections
- `waitroom/doodle/*`: Doodle plugins
- `waitroom/react`: React components only
