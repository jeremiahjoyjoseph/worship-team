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
import { IUser, Location } from "@/types/user";
import { format, parse } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";

interface AddUserProps {
  date: string;
  role: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (users: IUser[]) => void;
  users: IUser[];
  selectedUsers: IUser[];
  userAssignments: Map<string, { location: Location; role: string }>;
  currentLocation: Location;
}

export function AddUser({
  date,
  role,
  isOpen,
  onOpenChange,
  onUserSelect,
  users,
  selectedUsers,
  userAssignments,
  currentLocation,
}: AddUserProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    selectedUsers.map((user) => user._id)
  );

  // Add event listener for Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onOpenChange]);

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = () => {
    const selectedUsers = users.filter((user) =>
      selectedUserIds.includes(user._id)
    );
    onUserSelect(selectedUsers);
    setSelectedUserIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[500px] max-w-[80vw] max-h-[80vh] overflow-y-auto w-auto">
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
                .map((user) => {
                  const assignment = userAssignments.get(user._id);
                  const isAssignedElsewhere =
                    assignment && assignment.location !== currentLocation;

                  return (
                    <div key={user._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={user._id}
                        checked={selectedUserIds.includes(user._id)}
                        onCheckedChange={() => handleUserToggle(user._id)}
                      />
                      <label
                        htmlFor={user._id}
                        className="flex-1 cursor-pointer"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto"
                          onClick={() => handleUserToggle(user._id)}
                        >
                          <div className="flex flex-col items-start">
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
                            {isAssignedElsewhere && (
                              <Alert className="mt-1 py-1 px-2 bg-yellow-50 border-yellow-200">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                                <AlertDescription className="text-xs text-yellow-600">
                                  Currently assigned to {assignment?.role} at{" "}
                                  {assignment?.location}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </Button>
                      </label>
                    </div>
                  );
                })
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleConfirm}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
