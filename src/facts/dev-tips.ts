import { FactsPlugin, FactsInstance, Fact, FactsConfig } from "../core/types";

const TIPS: Fact[] = [
  {
    id: "1",
    text: "Ctrl+Shift+P opens command palette in VS Code",
    category: "vscode",
  },
  { id: "2", text: "Use git reflog to find lost commits", category: "git" },
  {
    id: "3",
    text: "Console.table() displays data in a table format",
    category: "js",
  },
  { id: "4", text: "Alt+Click to use multiple cursors", category: "vscode" },
];

class SimpleFactsRenderer implements FactsInstance {
  private container: HTMLElement;
  private facts: Fact[];
  private currentIndex = 0;
  private timer: any;
  private config: FactsConfig;

  constructor(container: HTMLElement, facts: Fact[], config?: FactsConfig) {
    this.container = container;
    this.facts = facts;
    this.config = config || {};

    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.padding = "20px";
    this.container.style.textAlign = "center";

    this.showCurrent();
    this.startRotation();
  }

  private showCurrent() {
    const fact = this.facts[this.currentIndex];
    this.container.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">Tip #${
              this.currentIndex + 1
            }</div>
            <div style="font-size: 1.1em;">${fact.text}</div>
            ${
              fact.category
                ? `<div style="font-size: 0.8em; color: #888; margin-top: 5px;">${fact.category}</div>`
                : ""
            }
        `;

    // Add timer bar
    const timerBar = document.createElement("div");
    timerBar.style.width = "0%";
    timerBar.style.height = "2px";
    timerBar.style.background = "#22c55e"; // Green progress
    timerBar.style.marginTop = "10px";
    timerBar.style.transition = `width ${
      this.config.rotationInterval || 4000
    }ms linear`;

    // Reset animation
    // Force reflow
    void this.container.offsetWidth;

    this.container.appendChild(timerBar);

    // Trigger animation
    requestAnimationFrame(() => {
      timerBar.style.width = "100%";
    });
  }

  private startRotation() {
    if (this.timer) clearInterval(this.timer);
    const interval = this.config.rotationInterval || 4000;
    this.timer = setInterval(() => this.next(), interval);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.facts.length;
    this.showCurrent();
  }

  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.facts.length) % this.facts.length;
    this.showCurrent();
  }

  favorite(id: string) {
    console.log("Fav:", id);
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.container.innerHTML = "";
  }
}

export const DevTipsFacts: FactsPlugin = {
  id: "dev-tips",
  name: "Developer Tips",
  category: "coding",
  facts: TIPS,
  renderMini: (c, cfg) => new SimpleFactsRenderer(c, TIPS, cfg),
  renderFull: (c, cfg) => new SimpleFactsRenderer(c, TIPS, cfg),
};
