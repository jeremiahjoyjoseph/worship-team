"use client";

import { Button } from "@/components/ui/button";
import { IUser, Location } from "@/types/user";
import { IWorshipTeam, ISubmission, ILocationRoster } from "@/types/roster";
import React from "react";
import { AddUser } from "./add-user";

interface RosterCellProps {
  date: string;
  role: string;
  colId: string;
  worshipTeam: IWorshipTeam[];
  submissions: ISubmission[];
  users: IUser[];
  allLocationRosters: ILocationRoster[];
  location: Location;
  onUpdate?: (date: string, role: string, user: IUser) => void;
}

export function RosterCell({
  date,
  role,
  colId,
  worshipTeam,
  submissions,
  users,
  allLocationRosters,
  location,
  onUpdate,
}: RosterCellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedUser = worshipTeam.find((member) => member.bandRole === role);

  const usersAssignedToDate = React.useMemo(() => {
    const assignedUsers = new Set<string>();
    allLocationRosters.forEach((locationRoster) => {
      const dateRoster = locationRoster.dateRosters.find(
        (dr) => dr.date === date
      );
      if (dateRoster) {
        dateRoster.worshipTeam.forEach((member) => {
          if (member.id) {
            assignedUsers.add(member.id);
          }
        });
      }
    });
    return assignedUsers;
  }, [allLocationRosters, date]);

  const availableAndUnusedUsers = users.filter((user) => {
    const allowedInLocation =
      user.allLocations ||
      user.locationPrimary === location ||
      user.locationSecondary === location ||
      user.locationSpare === location;

    if (!allowedInLocation) return false;

    const isAvailable =
      submissions.find(
        (s) => s.userId === user._id && s.submittedDates.includes(date)
      ) !== undefined;

    if (!isAvailable) return false;

    const matchesRole =
      colId === "worship-leader"
        ? ["worship-leader", "admin"].includes(user.role ?? "") &&
          (user.allBandRoles ||
            user.wtRolePrimary === "vocals" ||
            user.wtRoleSecondary === "vocals" ||
            user.wtRoleSpare === "vocals")
        : user.wtRolePrimary === colId ||
          user.wtRoleSecondary === colId ||
          user.wtRoleSpare === colId ||
          user.allBandRoles;

    if (!matchesRole) return false;

    const isAlreadyRostered = usersAssignedToDate.has(user._id);

    if (isAlreadyRostered) return false;

    return true;
  });

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
        users={availableAndUnusedUsers}
        submissions={submissions}
      />
    </>
  );
}
