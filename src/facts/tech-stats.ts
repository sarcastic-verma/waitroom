import { FactsPlugin, FactsInstance, Fact } from "../core/types";

const STATS: Fact[] = [
  { id: "1", text: "JavaScript is used by 98% of websites", category: "stats" },
  {
    id: "2",
    text: "There are over 1.3 million npm packages",
    category: "stats",
  },
];

class StatsRenderer implements FactsInstance {
  private container: HTMLElement;
  constructor(container: HTMLElement, facts: Fact[]) {
    this.container = container;
    this.container.innerText = facts[0].text;
  }

  next() {}
  previous() {}
  favorite() {}
  destroy() {
    this.container.innerHTML = "";
  }
}

export const TechStats: FactsPlugin = {
  id: "tech-stats",
  name: "Tech Stats",
  category: "stats",
  facts: STATS,
  renderMini: (c) => new StatsRenderer(c, STATS),
  renderFull: (c) => new StatsRenderer(c, STATS),
};
