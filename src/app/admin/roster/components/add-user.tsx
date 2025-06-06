"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ISubmission } from "@/types/roster";
import { IUser } from "@/types/user";
import { format, parse } from "date-fns";

interface AddUserProps {
  date: string;
  role: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (user: IUser) => void;
  users: IUser[];
  submissions: ISubmission[];
}

export function AddUser({
  date,
  role,
  isOpen,
  onOpenChange,
  onUserSelect,
  users,
  submissions,
}: AddUserProps) {
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
                  <Button
                    key={user._id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onUserSelect(user)}
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
                ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
