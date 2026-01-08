import { useState } from "react";
import { LoadingInteraction } from "waitroom";
import { SnakeGame } from "waitroom/games/snake";
import { DevTipsFacts } from "waitroom/facts/dev-tips";
import { BasicDoodle } from "waitroom/doodle/basic-canvas";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Waitroom Demo</h1>
        <p className="subtitle">Interactive Landing States</p>

        <div className="loading-wrapper">
          <LoadingInteraction
            isLoading={loading}
            availableModes={["game", "facts", "doodle"]}
            mode="game"
            game={SnakeGame}
            facts={DevTipsFacts}
            doodle={BasicDoodle}
            // Aesthetic props
            transitionDuration={400}
            theme="custom"
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>

        <div className="controls">
          <button className="toggle-btn" onClick={() => setLoading(!loading)}>
            {loading ? "Stop Loading" : "Start Loading"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
