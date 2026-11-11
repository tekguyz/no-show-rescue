import { defineConfig } from "vitest/config";
import path from "node:path";

// Unit tests live in `__tests__/` folders beside the code they test.
// Fast, no network. Run with `npm run test:unit`, never `npm test`.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    // Worktrees hold a full second copy of the suite; never pick those up.
    exclude: ["**/node_modules/**", "**/.next/**", "**/.claude/worktrees/**", "**/.worktrees/**"],
  },
});
