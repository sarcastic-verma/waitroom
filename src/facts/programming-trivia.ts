import { FactsPlugin, FactsInstance, Fact } from "../core/types";

const TRIVIA: Fact[] = [
  {
    id: "1",
    text: "The first computer bug was an actual moth found in a relay",
    category: "history",
  },
  {
    id: "2",
    text: "JavaScript was created in 10 days by Brendan Eich",
    category: "history",
  },
  {
    id: "3",
    text: "Python is named after Monty Python, not the snake",
    category: "history",
  },
];

class TriviaRenderer implements FactsInstance {
  private container: HTMLElement;
  private facts: Fact[];
  private currentIndex = 0;

  constructor(container: HTMLElement, facts: Fact[]) {
    this.container = container;
    this.facts = facts;
    this.show();
  }

  show() {
    this.container.innerText = this.facts[this.currentIndex].text;
    this.container.style.textAlign = "center";
    this.container.style.padding = "10px";
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.facts.length;
    this.show();
  }

  previous() {}
  favorite() {}
  destroy() {
    this.container.innerHTML = "";
  }
}

export const ProgrammingTrivia: FactsPlugin = {
  id: "prog-trivia",
  name: "Programming Trivia",
  category: "trivia",
  facts: TRIVIA,
  renderMini: (c) => new TriviaRenderer(c, TRIVIA),
  renderFull: (c) => new TriviaRenderer(c, TRIVIA),
};
