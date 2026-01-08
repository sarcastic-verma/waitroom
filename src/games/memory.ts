import { GamePlugin, GameInstance, GameState } from "../core/types";

// Memory Game Logic
interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

class MemoryInstance implements GameInstance {
  private container: HTMLElement;
  private state: Partial<GameState>;
  private cards: Card[] = [];
  private flippedCards: Card[] = [];
  private grid: HTMLElement;
  private messageDisplay: HTMLElement;
  private isLocked = false;

  private emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"]; // 6 pairs for 3x4 grid

  constructor(container: HTMLElement, state: Partial<GameState>) {
    this.container = container;
    this.state = state;

    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.fontFamily = "sans-serif";

    // Title and Helper
    const title = document.createElement("h3");
    title.innerText = "Memory Match";
    title.style.margin = "0 0 5px 0";
    this.container.appendChild(title);

    const helper = document.createElement("div");
    helper.innerText = "Find matching pairs";
    helper.style.fontSize = "0.8em";
    helper.style.color = "#888";
    helper.style.marginBottom = "10px";
    this.container.appendChild(helper);

    this.messageDisplay = document.createElement("div");
    this.messageDisplay.style.height = "20px";
    this.messageDisplay.style.fontSize = "14px";
    this.messageDisplay.style.fontWeight = "bold";
    this.messageDisplay.style.marginBottom = "5px";
    this.container.appendChild(this.messageDisplay);

    this.grid = document.createElement("div");
    this.grid.style.display = "grid";
    this.grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    this.grid.style.gap = "8px";
    this.container.appendChild(this.grid);

    this.initGame();
  }

  private initGame() {
    // Create pairs
    const deck = [...this.emojis, ...this.emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }));

    this.cards = deck;
    this.renderGrid();
  }

  private renderGrid() {
    this.grid.innerHTML = "";
    this.cards.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.style.width = "50px";
      cardEl.style.height = "50px";
      cardEl.style.background =
        card.isFlipped || card.isMatched ? "#fff" : "#22c55e";
      cardEl.style.border = "1px solid #ccc";
      cardEl.style.borderRadius = "8px";
      cardEl.style.display = "flex";
      cardEl.style.alignItems = "center";
      cardEl.style.justifyContent = "center";
      cardEl.style.fontSize = "24px";
      cardEl.style.cursor = "pointer";
      cardEl.style.transition = "transform 0.2s, background 0.2s";

      if (card.isFlipped || card.isMatched) {
        cardEl.innerText = card.value;
        cardEl.style.transform = "rotateY(0deg)";
      } else {
        cardEl.innerText = "";
        cardEl.style.transform = "rotateY(180deg)";
      }

      cardEl.onclick = () => this.handleCardClick(card);
      this.grid.appendChild(cardEl);
    });
  }

  private handleCardClick(card: Card) {
    if (this.isLocked || card.isFlipped || card.isMatched) return;

    // Flip card
    card.isFlipped = true;
    this.flippedCards.push(card);
    this.renderGrid();

    // Check match
    if (this.flippedCards.length === 2) {
      this.isLocked = true;
      this.checkMatch();
    }
  }

  private checkMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.value === card2.value) {
      // Match!
      card1.isMatched = true;
      card2.isMatched = true;
      this.flippedCards = [];
      this.isLocked = false;
      this.renderGrid();
      this.checkWin();
    } else {
      // No match
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isLocked = false;
        this.renderGrid();
      }, 1000);
    }
  }

  private checkWin() {
    if (this.cards.every((c) => c.isMatched)) {
      this.messageDisplay.innerText = "You Won! 🎉";
      this.messageDisplay.style.color = "green";
      setTimeout(() => this.initGame(), 3000); // Restart
    }
  }

  getState() {
    return this.state as GameState;
  }
  setState(s: Partial<GameState>) {
    this.state = { ...this.state, ...s };
  }
  destroy() {
    this.container.innerHTML = "";
  }
}

export const MemoryGame: GamePlugin = {
  id: "memory",
  name: "Memory Match",
  description: "Find matching pairs",
  renderMini: (c, s) => new MemoryInstance(c, s),
  renderFull: (c, s) => new MemoryInstance(c, s),
};
