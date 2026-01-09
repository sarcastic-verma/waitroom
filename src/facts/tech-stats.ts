import { FactsPlugin, Fact } from "../core/types";
import { BaseFactsRenderer } from "./base-renderer";

export const STATS: Fact[] = [
  { id: "1", text: "JavaScript is used by 98% of websites", category: "stats" },
  {
    id: "2",
    text: "There are over 1.3 million npm packages",
    category: "stats",
  },
];

export const TechStats: FactsPlugin = {
  id: "tech-stats",
  name: "Tech Stats",
  category: "stats",
  facts: STATS,
  renderMini: (c, cfg) => new BaseFactsRenderer(c, STATS, cfg),
  renderFull: (c, cfg) => new BaseFactsRenderer(c, STATS, cfg),
};
