"use client";

import React from "react";

type DisplayMode = "hover" | "context-menu";

interface SettingsContextType {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const SettingsContext = React.createContext<SettingsContextType | null>(
  null
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayMode] =
    React.useState<DisplayMode>("context-menu");

  return (
    <SettingsContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
