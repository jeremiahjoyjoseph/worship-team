"use client";

import React from "react";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IUser } from "@/types/user";

interface AddUserProps {
  date: string;
  role: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (user: IUser) => void;
}

export function AddUser({
  date,
  role,
  isOpen,
  onOpenChange,
  onUserSelect,
}: AddUserProps) {
  const [users, setUsers] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    // TODO: Implement user fetching and filtering logic
    setUsers([]);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Select {role} for{" "}
            {format(parse(date, "d MMMM yyyy", new Date()), "MMM d")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {users.map((user) => (
              <Button
                key={user._id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onUserSelect(user)}
              >
                {user.fullName}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
