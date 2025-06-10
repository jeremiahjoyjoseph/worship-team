"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BAND_ROLES } from "@/constants/band-roles";
import { ILocationRoster, ISubmission } from "@/types/roster";
import { IUser, Location } from "@/types/user";
import { getAllSundays } from "@/util/date-utils";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parse } from "date-fns";
import React from "react";
import { createColumns, TableData } from "./columns";

interface RosterGridProps {
  month: string;
  location: Location;
  locationRoster: ILocationRoster;
  submissions: ISubmission[];
  users: IUser[];
  allLocationRosters: ILocationRoster[];
  onRosterUpdate: (updatedRoster: ILocationRoster[]) => void;
}

export function RosterGrid({
  month,
  location,
  locationRoster,
  submissions,
  users,
  allLocationRosters,
  onRosterUpdate,
}: RosterGridProps) {
  const sundays = getAllSundays(month);
  const columnWidth = `calc(100% / ${BAND_ROLES.length + 1})`;
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Transform data for table
  const tableData: TableData[] = sundays.map((dateStr) => {
    const date = parse(dateStr, "d MMMM yyyy", new Date());
    const dateRoster = locationRoster.dateRosters.find(
      (dr) => dr.date === dateStr
    );
    const worshipTeam = dateRoster?.worshipTeam ?? [];

    return {
      date: format(date, "MMM d"),
      dateStr,
      worshipTeam,
    };
  });

  const table = useReactTable({
    data: tableData,
    columns: createColumns(
      submissions,
      users,
      allLocationRosters,
      location,
      month,
      onRosterUpdate
    ),
    state: {
      columnFilters,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="capitalize border border-gray-200 bg-gray-50"
                  style={{
                    width: columnWidth,
                  }}
                >
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-transparent">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: columnWidth,
                  }}
                  className="p-2 border border-gray-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
