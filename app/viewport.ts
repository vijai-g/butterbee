// app/viewport.ts
import type { Viewport } from "next";

export const viewport: Viewport = {
  // One color or an array with media queries
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFC107" },
    { media: "(prefers-color-scheme: dark)",  color: "#111111" },
  ],
  colorScheme: "light",
};
