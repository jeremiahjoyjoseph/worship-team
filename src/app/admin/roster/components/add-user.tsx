"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IUser } from "@/types/user";
import { format, parse } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface AddUserProps {
  date: string;
  role: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (user: IUser) => void;
  users: IUser[];
}

export function AddUser({
  date,
  role,
  isOpen,
  onOpenChange,
  onUserSelect,
  users,
}: AddUserProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    selectedUsers.forEach((userId) => {
      const user = users.find((u) => u._id === userId);
      if (user) {
        onUserSelect(user);
      }
    });
    setSelectedUsers(new Set());
    onOpenChange(false);
  };

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
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available users
              </p>
            ) : (
              [...users]
                .sort((a, b) =>
                  (a.fullName ?? "").localeCompare(b.fullName ?? "")
                )
                .map((user) => (
                  <div key={user._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user._id}
                      checked={selectedUsers.has(user._id)}
                      onCheckedChange={() => handleUserToggle(user._id)}
                    />
                    <label htmlFor={user._id} className="flex-1 cursor-pointer">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleUserToggle(user._id)}
                      >
                        <span>
                          {user.fullName}
                          <span className="text-xs text-muted-foreground ml-2">
                            ({user.wtRolePrimary})
                          </span>
                          {user.wtRoleSecondary && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({user.wtRoleSecondary})
                            </span>
                          )}
                          {user.wtRoleSpare && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({user.wtRoleSpare})
                            </span>
                          )}
                          {user.allBandRoles && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (All)
                            </span>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={selectedUsers.size === 0}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
