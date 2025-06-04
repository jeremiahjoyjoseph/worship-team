"use client";

import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user";
import { IWorshipTeam } from "@/types/roster";
import React from "react";
import { AddUser } from "./add-user";

interface RosterCellProps {
  date: string;
  role: string;
  worshipTeam: IWorshipTeam[];
  onUpdate?: (date: string, role: string, user: IUser) => void;
}

export function RosterCell({
  date,
  role,
  worshipTeam,
  onUpdate,
}: RosterCellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedUser = worshipTeam.find((member) => member.bandRole === role);

  const handleUserSelect = (user: IUser) => {
    onUpdate?.(date, role, user);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="h-20 w-full justify-start text-left font-normal hover:bg-muted/50"
        onClick={() => setIsOpen(true)}
      >
        {selectedUser ? selectedUser.name : ""}
      </Button>

      <AddUser
        date={date}
        role={role}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onUserSelect={handleUserSelect}
      />
    </>
  );
}
