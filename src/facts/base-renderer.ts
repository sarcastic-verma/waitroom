import { FactsInstance, Fact, FactsConfig } from "../core/types";

export class BaseFactsRenderer implements FactsInstance {
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

    if (this.config.shuffle) {
      this.currentIndex = Math.floor(Math.random() * this.facts.length);
    }

    this.showCurrent();
    this.startRotation();
  }

  private showCurrent() {
    if (this.facts.length === 0) return;

    const fact = this.facts[this.currentIndex];
    this.container.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">Fact #${
              this.currentIndex + 1
            }</div>
            <div style="font-size: 1.1em; line-height: 1.4;">${fact.text}</div>
            ${
              fact.category
                ? `<div style="font-size: 0.8em; color: #888; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">${fact.category}</div>`
                : ""
            }
        `;

    // Add timer bar
    const timerBar = document.createElement("div");
    timerBar.style.width = "0%";
    timerBar.style.height = "2px";
    timerBar.style.background = "#22c55e"; // Green progress
    timerBar.style.marginTop = "15px";
    timerBar.style.borderRadius = "2px";
    const interval = this.config.rotationInterval || 4000;
    timerBar.style.transition = `width ${interval}ms linear`;

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
    if (this.facts.length <= 1) return;

    const interval = this.config.rotationInterval || 4000;
    this.timer = setInterval(() => this.next(), interval);
  }

  next() {
    if (this.facts.length <= 1) return;

    if (this.config.shuffle) {
      let nextIndex = this.currentIndex;
      while (nextIndex === this.currentIndex && this.facts.length > 1) {
        nextIndex = Math.floor(Math.random() * this.facts.length);
      }
      this.currentIndex = nextIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.facts.length;
    }
    this.showCurrent();
  }

  previous() {
    if (this.facts.length <= 1) return;

    if (this.config.shuffle) {
      this.next(); // For shuffle, previous is just another random one
    } else {
      this.currentIndex =
        (this.currentIndex - 1 + this.facts.length) % this.facts.length;
    }
    this.showCurrent();
  }

  favorite(id: string) {
    console.log("Fact favorited:", id);
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.container.innerHTML = "";
  }
}
