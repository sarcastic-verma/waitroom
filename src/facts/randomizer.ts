import { FactsPlugin, Fact } from "../core/types";
import { BaseFactsRenderer } from "./base-renderer";
import { TIPS } from "./dev-tips";
import { TRIVIA } from "./programming-trivia";
import { STATS } from "./tech-stats";

const ALL_FACTS: Fact[] = [...TIPS, ...TRIVIA, ...STATS];

export const FactRandomizer: FactsPlugin = {
  id: "fact-randomizer",
  name: "Random Facts",
  category: "all",
  facts: ALL_FACTS,
  renderMini: (c, cfg) =>
    new BaseFactsRenderer(c, ALL_FACTS, { ...cfg, shuffle: true }),
  renderFull: (c, cfg) =>
    new BaseFactsRenderer(c, ALL_FACTS, { ...cfg, shuffle: true }),
};
