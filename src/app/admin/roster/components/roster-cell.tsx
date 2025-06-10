"use client";

import { Button } from "@/components/ui/button";
import { getRoster, updateRoster } from "@/app/api/roster/api";
import { IUser, Location } from "@/types/user";
import {
  IWorshipTeam,
  ISubmission,
  ILocationRoster,
  IDateRoster,
} from "@/types/roster";
import React from "react";
import { AddUser } from "./add-user";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { useSettings } from "../context/settings-context";

interface RosterCellProps {
  date: string;
  role: string;
  colId: string;
  worshipTeam: IWorshipTeam[];
  submissions: ISubmission[];
  users: IUser[];
  allLocationRosters: ILocationRoster[];
  location: Location;
  month: string;
  onRosterUpdate: (updatedRoster: ILocationRoster[]) => void;
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
  month,
  onRosterUpdate,
}: RosterCellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { displayMode } = useSettings();

  const selectedUsers = React.useMemo(
    () => worshipTeam.find((team) => team.bandRole === role)?.members ?? [],
    [worshipTeam, role]
  );

  const selectedUserObjects = React.useMemo(
    () =>
      selectedUsers
        .map((member) => users.find((user) => user._id === member.id))
        .filter((user): user is IUser => user !== undefined),
    [selectedUsers, users]
  );

  const availableAndUnusedUsers = React.useMemo(
    () =>
      users.filter((user) => {
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

        // Special handling for MD column
        if (colId === "md") {
          // Include users who are already in the worship team
          const isInWorshipTeam = worshipTeam.some((team) =>
            team.members?.some((member) => member.id === user._id)
          );

          // Include users who are MDs
          const isMD = user.md === true;

          return isInWorshipTeam || isMD;
        }

        // Regular role matching for other columns
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

        return true;
      }),
    [users, location, submissions, date, colId, worshipTeam]
  );

  // Find where users are currently assigned
  const userAssignments = React.useMemo(() => {
    const assignments = new Map<string, { location: Location; role: string }>();
    allLocationRosters.forEach((locationRoster) => {
      locationRoster.dateRosters.forEach((dateRoster) => {
        if (dateRoster.date === date) {
          dateRoster.worshipTeam.forEach((team) => {
            team.members?.forEach((member) => {
              if (member.id) {
                assignments.set(member.id, {
                  location: locationRoster.location,
                  role: team.bandRole,
                });
              }
            });
          });
        }
      });
    });
    return assignments;
  }, [allLocationRosters, date]);

  const handleUserSelect = async (users: IUser[]) => {
    try {
      setIsLoading(true);
      const currentRoster = await getRoster(month.replace(/-/g, " "));

      const updatedRoster = currentRoster.roster.map(
        (locationRoster: ILocationRoster) => {
          // For the current location, update/add members
          if (locationRoster.location === location) {
            return {
              ...locationRoster,
              dateRosters: locationRoster.dateRosters.map(
                (dateRoster: IDateRoster) => {
                  if (dateRoster.date !== date) return dateRoster;

                  // Find the existing team for this role
                  const existingTeam = dateRoster.worshipTeam.find(
                    (team: IWorshipTeam) => team.bandRole === role
                  );

                  // If no users selected, remove the team
                  if (users.length === 0) {
                    return {
                      ...dateRoster,
                      worshipTeam: dateRoster.worshipTeam.filter(
                        (team: IWorshipTeam) => team.bandRole !== role
                      ),
                    };
                  }

                  // If team exists, update its members
                  if (existingTeam) {
                    return {
                      ...dateRoster,
                      worshipTeam: dateRoster.worshipTeam.map(
                        (team: IWorshipTeam) =>
                          team.bandRole === role
                            ? {
                                ...team,
                                members: users.map((user) => ({
                                  id: user._id,
                                  name: user.fullName ?? "",
                                })),
                              }
                            : team
                      ),
                    };
                  }

                  // If team doesn't exist, add new team with members
                  return {
                    ...dateRoster,
                    worshipTeam: [
                      ...dateRoster.worshipTeam,
                      {
                        bandRole: role,
                        members: users.map((user) => ({
                          id: user._id,
                          name: user.fullName ?? "",
                        })),
                      },
                    ],
                  };
                }
              ),
            };
          }

          // For other locations, remove the selected users from the same role
          return {
            ...locationRoster,
            dateRosters: locationRoster.dateRosters.map(
              (dateRoster: IDateRoster) => {
                if (dateRoster.date !== date) return dateRoster;

                return {
                  ...dateRoster,
                  worshipTeam: dateRoster.worshipTeam.map(
                    (team: IWorshipTeam) => {
                      if (team.bandRole === role) {
                        return {
                          ...team,
                          members:
                            team.members?.filter(
                              (member) =>
                                !users.some((user) => user._id === member.id)
                            ) ?? [],
                        };
                      }
                      return team;
                    }
                  ),
                };
              }
            ),
          };
        }
      );

      // Update the backend
      await updateRoster(month.replace(/-/g, " "), {
        ...currentRoster,
        submissions: currentRoster.submissions,
        roster: updatedRoster,
      });

      // Update parent state
      onRosterUpdate(updatedRoster);
    } catch (err) {
      console.error("Error updating roster:", err);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const renderUserInfo = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Available Users</h4>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-1 text-sm font-medium">Name</th>
              <th className="text-left py-2 px-1 text-sm font-medium">
                Available Dates
              </th>
            </tr>
          </thead>
          <tbody>
            {availableAndUnusedUsers.map((user) => {
              const userSubmission = submissions.find(
                (s) => s.userId === user._id
              );
              const submittedDates = userSubmission?.submittedDates || [];

              return (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-1">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.wtRolePrimary && (
                        <span>Primary: {user.wtRolePrimary}</span>
                      )}
                      {user.wtRoleSecondary && (
                        <span className="ml-2">
                          Secondary: {user.wtRoleSecondary}
                        </span>
                      )}
                      {user.wtRoleSpare && (
                        <span className="ml-2">Spare: {user.wtRoleSpare}</span>
                      )}
                      {user.allBandRoles && (
                        <span className="ml-2">(All Roles)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-1">
                    <div className="text-sm text-muted-foreground">
                      {submittedDates.map((date) => (
                        <div key={date} className="text-xs">
                          {format(new Date(date), "MMM d")}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const button = (
    <Button
      variant="ghost"
      className="h-20 w-full justify-start text-left font-normal hover:bg-muted/50"
      onClick={() => setIsOpen(true)}
      disabled={isLoading}
    >
      {selectedUsers.length > 0 ? (
        <div className="flex flex-col items-start gap-1">
          {selectedUsers.map((member) => (
            <span key={member.id} className="text-sm">
              {member.name}
            </span>
          ))}
        </div>
      ) : (
        ""
      )}
    </Button>
  );

  if (displayMode === "hover") {
    return (
      <>
        <HoverCard>
          <HoverCardTrigger asChild>{button}</HoverCardTrigger>
          <HoverCardContent className="min-w-[400px] max-w-[600px] w-auto">
            {renderUserInfo()}
          </HoverCardContent>
        </HoverCard>
        <AddUser
          date={date}
          role={role}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onUserSelect={handleUserSelect}
          users={availableAndUnusedUsers}
          selectedUsers={selectedUserObjects}
          userAssignments={userAssignments}
          currentLocation={location}
        />
      </>
    );
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div>{button}</div>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-[400px] max-w-[600px] w-auto">
          {renderUserInfo()}
        </ContextMenuContent>
      </ContextMenu>
      <AddUser
        date={date}
        role={role}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onUserSelect={handleUserSelect}
        users={availableAndUnusedUsers}
        selectedUsers={selectedUserObjects}
        userAssignments={userAssignments}
        currentLocation={location}
      />
    </>
  );
}
