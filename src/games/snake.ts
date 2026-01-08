import { GamePlugin, GameInstance, GameState } from "../core/types";

class SnakeInstance implements GameInstance {
  private container: HTMLElement;
  private state: Partial<GameState>;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private loopId: number | null = null;
  private snake: { x: number; y: number }[] = [];
  private food: { x: number; y: number } = { x: 0, y: 0 };
  private direction = { x: 1, y: 0 };
  private gridSize = 10;
  private tiles = 20;

  constructor(container: HTMLElement, state: Partial<GameState>) {
    this.container = container;
    this.state = state;
    this.canvas = document.createElement("canvas");
    this.canvas.height = 150;
    this.canvas.style.border = "1px solid #333";
    this.canvas.style.display = "block";
    this.canvas.style.margin = "0 auto"; // Center canvas

    // Title
    const title = document.createElement("h3");
    title.innerText = "Snake";
    title.style.margin = "0 0 5px 0";
    title.style.textAlign = "center";
    title.style.fontFamily = "sans-serif";
    this.container.appendChild(title);

    // Helper
    const helper = document.createElement("div");
    helper.innerText = "Use arrow keys to move";
    helper.style.fontSize = "0.8em";
    helper.style.color = "#888";
    helper.style.marginBottom = "5px";
    helper.style.textAlign = "center";
    helper.style.fontFamily = "sans-serif";
    this.container.appendChild(helper);

    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.appendChild(this.canvas);

    // Canvas CSS Layout
    this.canvas.style.width = "90%"; // Leave some margins
    this.canvas.style.flex = "1"; // Take remaining vertical space
    this.canvas.style.minHeight = "0"; // Allow shrinking in flex container
    this.canvas.style.border = "1px solid #333";
    this.canvas.style.marginTop = "10px";
    this.canvas.style.background = "#222";

    this.ctx = this.canvas.getContext("2d")!;

    this.reset();
    this.setupInput();

    // Resize observer to handle dynamic sizing
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(this.canvas);

    this.resize();

    this.loopId = requestAnimationFrame(this.loop.bind(this));
  }

  private resize() {
    // Fit to internal resolution to displayed size
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Ensure grid alignment
    this.tiles = Math.floor(rect.width / this.gridSize);
  }

  private reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.placeFood();
  }

  private placeFood() {
    this.food = {
      x: Math.floor(Math.random() * this.tiles),
      y: Math.floor(Math.random() * (this.canvas.height / this.gridSize)),
    };
  }

  private setupInput() {
    window.addEventListener("keydown", this.handleKey.bind(this));
  }

  private handleKey(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp":
        if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
        break;
    }
  }

  private update() {
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y,
    };

    // Wrap around
    if (head.x < 0) head.x = this.tiles - 1;
    if (head.x >= this.tiles) head.x = 0;
    if (head.y < 0) head.y = Math.floor(this.canvas.height / this.gridSize) - 1;
    if (head.y >= Math.floor(this.canvas.height / this.gridSize)) head.y = 0;

    // Self collision
    for (const part of this.snake) {
      if (part.x === head.x && part.y === head.y) {
        this.reset();
        return;
      }
    }

    this.snake.unshift(head);

    // Eat food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.placeFood();
      // Update score in state
      this.state.progress = {
        ...this.state.progress,
        score: (this.state.progress?.score || 0) + 10,
      } as any;
    } else {
      this.snake.pop();
    }
  }

  private draw() {
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#4CAF50";
    for (const part of this.snake) {
      this.ctx.fillRect(
        part.x * this.gridSize,
        part.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      );
    }

    this.ctx.fillStyle = "#FF5722";
    this.ctx.fillRect(
      this.food.x * this.gridSize,
      this.food.y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
  }

  private lastTime = 0;
  private loop(time: number) {
    if (!this.loopId) return;

    if (time - this.lastTime > 100) {
      // 10 FPS
      this.update();
      this.draw();
      this.lastTime = time;
    }

    this.loopId = requestAnimationFrame(this.loop.bind(this));
  }

  public getState() {
    return this.state as GameState;
  }

  public setState(newState: Partial<GameState>) {
    this.state = { ...this.state, ...newState };
  }

  public destroy() {
    if (this.loopId) cancelAnimationFrame(this.loopId);
    this.loopId = null;
    window.removeEventListener("keydown", this.handleKey.bind(this));
    this.canvas.remove();
  }
}

export const SnakeGame: GamePlugin = {
  id: "snake",
  name: "Snake",
  description: "Classic Snake Game",

  renderMini: (container, state) => new SnakeInstance(container, state),
  renderFull: (container, state) => new SnakeInstance(container, state),
};
