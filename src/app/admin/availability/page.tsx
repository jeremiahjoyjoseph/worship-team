"use client";
import { getRoster } from "@/app/api/roster/api";
import { getUsers } from "@/app/api/user/api";
import { AvailabilityUser, ISubmission } from "@/types/roster";
import { IUser } from "@/types/user";
import React from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { DataTableToolbarMonth } from "./components/data-table-toolbar-month";

export default function Availability() {
  const [data, setData] = React.useState<AvailabilityUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [month, setMonth] = React.useState<string | undefined>(() => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  });

  React.useEffect(() => {
    async function fetchAvailability() {
      try {
        const [users, roster] = await Promise.all([
          getUsers(),
          getRoster(month),
        ]);

        const sortedUsers: IUser[] = users.sort((a: IUser, b: IUser) =>
          (a.fullName ?? "").localeCompare(b.fullName ?? "")
        );

        const submissions = roster?.submissions ?? []; // safe default

        const availabilityList: AvailabilityUser[] = submissions
          .filter(
            (submission: ISubmission) =>
              (submission.submittedDates?.length ?? 0) > 0
          )
          .map((submission: ISubmission) => {
            const matchedUser = sortedUsers.find(
              (u) => u._id === submission.userId
            );

            if (!matchedUser) return null; // optional safety: if no matched user, skip

            return {
              ...matchedUser,
              submittedDates: submission.submittedDates || [],
            } as AvailabilityUser;
          })
          .filter(Boolean); // remove any nulls just in case

        setData(availabilityList);
      } catch (err) {
        console.error("Error fetching availability data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailability();
  }, [month]);

  return (
    <div className="w-[100vw] pb-10">
      <div className="mt-8 px-8">
        <DataTableToolbarMonth month={month} setMonth={setMonth} />
      </div>
      <DataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
}
