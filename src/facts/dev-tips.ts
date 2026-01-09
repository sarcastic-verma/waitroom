import { FactsPlugin, Fact } from "../core/types";
import { BaseFactsRenderer } from "./base-renderer";

export const TIPS: Fact[] = [
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

export const DevTipsFacts: FactsPlugin = {
  id: "dev-tips",
  name: "Developer Tips",
  category: "coding",
  facts: TIPS,
  renderMini: (c, cfg) => new BaseFactsRenderer(c, TIPS, cfg),
  renderFull: (c, cfg) => new BaseFactsRenderer(c, TIPS, cfg),
};
