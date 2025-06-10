"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useSettings } from "../context/settings-context";

export function SettingsDropdown() {
  const { displayMode, setDisplayMode } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setDisplayMode("hover")}
          className={displayMode === "hover" ? "bg-accent" : ""}
        >
          Hover Mode
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setDisplayMode("context-menu")}
          className={displayMode === "context-menu" ? "bg-accent" : ""}
        >
          Right-Click Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
