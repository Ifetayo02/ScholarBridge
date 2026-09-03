"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class" // This tells it to use the .dark class in global.css
      defaultTheme="system" // Reads user's OS preference first
      enableSystem
      disableTransitionOnChange // Prevents flash on load
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}