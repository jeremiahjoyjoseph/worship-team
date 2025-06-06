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
  onUpdate?: (date: string, role: string, user: IUser) => void;
}

export function RosterGrid({
  month,
  location,
  locationRoster,
  submissions,
  users,
  allLocationRosters,
  onUpdate,
}: RosterGridProps) {
  const sundays = getAllSundays(month);
  const roleColumnWidth = `calc((100% - 100px) / ${BAND_ROLES.length})`;
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
      onUpdate!,
      submissions,
      users,
      allLocationRosters,
      location
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
                  className="capitalize"
                  style={{
                    width: header.id === "date" ? "100px" : roleColumnWidth,
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
                    width:
                      cell.column.id === "date" ? "100px" : roleColumnWidth,
                  }}
                  className="p-0"
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
