"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // This tells it to use the .dark class in global.css
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange // Prevents flash on load
    >
      {children}
    </NextThemesProvider>
  );
}