"use client";

import { IUser, Location } from "@/types/user";
import { ISubmission } from "@/types/roster";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AvailableUsersListProps {
  users: IUser[];
  submissions: ISubmission[];
  location: Location;
}

export function AvailableUsersList({
  users,
  submissions,
  location,
}: AvailableUsersListProps) {
  const availableUsers = users.filter((user) => {
    const allowedInLocation =
      user.allLocations ||
      user.locationPrimary === location ||
      user.locationSecondary === location ||
      user.locationSpare === location;

    if (!allowedInLocation) return false;

    const hasSubmissions = submissions.some(
      (s) => s.userId === user._id && s.submittedDates.length > 0
    );

    return hasSubmissions;
  });

  return (
    <Card className="mt-4 w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Available Users for {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Available Dates</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableUsers.map((user) => {
              const userSubmission = submissions.find(
                (s) => s.userId === user._id
              );
              const submittedDates = userSubmission?.submittedDates || [];

              return (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>Primary: {user.wtRolePrimary || "None"}</div>
                      {user.wtRoleSecondary && (
                        <div>Secondary: {user.wtRoleSecondary}</div>
                      )}
                      {user.wtRoleSpare && <div>Spare: {user.wtRoleSpare}</div>}
                      {user.allBandRoles && <div>All Band Roles</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {submittedDates.map((date) => (
                        <div key={date}>{format(new Date(date), "MMM d")}</div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
