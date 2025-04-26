"use client";
import { getRoster } from "@/app/api/roster/api";
import { getUsers } from "@/app/api/user/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvailabilityUser, ISubmission } from "@/types/roster";
import { IUser } from "@/types/user";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { columns } from "./components/columns";
import { DataTablePagination } from "./components/data-pagination";
import { DataTableToolbar } from "./components/data-table-toolbar";

export default function Availability() {
  const [data, setData] = React.useState<AvailabilityUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    async function fetchAvailability() {
      try {
        const [users, roster] = await Promise.all([
          getUsers(),
          getRoster("June-2025"),
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
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="w-[100vw] pb-10">
      <div className="mt-8 px-8">
        <DataTableToolbar table={table} />
      </div>

      {/* Table */}
      <div className="w-full mt-4 px-8">
        <div className="rounded-md border max-h-[532px] overflow-y-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4 w-[100vw] px-8">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
