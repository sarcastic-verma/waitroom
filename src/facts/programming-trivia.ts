import { FactsPlugin, Fact } from "../core/types";
import { BaseFactsRenderer } from "./base-renderer";

export const TRIVIA: Fact[] = [
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

export const ProgrammingTrivia: FactsPlugin = {
  id: "prog-trivia",
  name: "Programming Trivia",
  category: "trivia",
  facts: TRIVIA,
  renderMini: (c, cfg) => new BaseFactsRenderer(c, TRIVIA, cfg),
  renderFull: (c, cfg) => new BaseFactsRenderer(c, TRIVIA, cfg),
};
