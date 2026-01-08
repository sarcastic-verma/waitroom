import { GamePlugin, GameInstance, GameState } from "../core/types";

class ClickCounterInstance implements GameInstance {
  private container: HTMLElement;
  private state: Partial<GameState>;
  private button: HTMLButtonElement;
  private scoreDisplay: HTMLElement;

  constructor(container: HTMLElement, state: Partial<GameState>) {
    this.container = container;
    this.state = state;

    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.fontFamily = "sans-serif"; // consistent font

    // Title
    const title = document.createElement("h3");
    title.innerText = "Click Counter";
    title.style.margin = "0 0 5px 0";
    this.container.appendChild(title);

    // Helper
    const helper = document.createElement("div");
    helper.innerText = "Click as fast as you can!";
    helper.style.fontSize = "0.8em";
    helper.style.color = "#888";
    helper.style.marginBottom = "10px";
    this.container.appendChild(helper);

    this.scoreDisplay = document.createElement("div");
    this.scoreDisplay.style.fontSize = "24px";
    this.scoreDisplay.style.marginBottom = "10px";
    this.updateScore();
    this.container.appendChild(this.scoreDisplay);

    this.button = document.createElement("button");
    this.button.innerText = "Click Me!";
    this.button.style.padding = "10px 20px";
    this.button.style.fontSize = "16px";
    this.button.style.cursor = "pointer";
    this.button.onclick = () => this.increment();
    this.container.appendChild(this.button);
  }

  private increment() {
    const currentScore = this.state.progress?.score || 0;
    this.state.progress = {
      ...this.state.progress,
      score: currentScore + 1,
    } as any;
    this.updateScore();
  }

  private updateScore() {
    this.scoreDisplay.innerText = `Clics: ${this.state.progress?.score || 0}`;
  }

  getState() {
    return this.state as GameState;
  }
  setState(s: Partial<GameState>) {
    this.state = { ...this.state, ...s };
    this.updateScore();
  }
  destroy() {
    this.container.innerHTML = "";
  }
}

export const ClickCounterGame: GamePlugin = {
  id: "click-counter",
  name: "Click Counter",
  description: "Click as fast as you can!",
  renderMini: (c, s) => new ClickCounterInstance(c, s),
  renderFull: (c, s) => new ClickCounterInstance(c, s),
};
