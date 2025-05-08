import { AvailabilityUser } from "@/types/roster";
import { ColumnDef } from "@tanstack/react-table";

import { Row } from "@tanstack/react-table";

export const caseInsensitiveFilter = (
  row: Row<AvailabilityUser>,
  columnId: string,
  filterValue: string[]
) => {
  const rawValue = row.getValue(columnId);

  // Normalize to array for uniform handling
  const values = Array.isArray(rawValue) ? rawValue : [rawValue];

  return values.some((val) => filterValue.includes(String(val).toLowerCase()));
};

export const matchDayNumbers = (
  row: Row<AvailabilityUser>,
  columnId: string,
  filterValue: string[]
) => {
  const dates = row.getValue(columnId);
  if (!Array.isArray(dates)) return false;

  return dates.some((dateStr) => {
    const day = new Date(dateStr).getDate().toString();
    return filterValue.includes(day);
  });
};

export const columns: ColumnDef<AvailabilityUser>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <span>{row.original.fullName || "N/A"}</span>,
  },
  {
    accessorKey: "submittedDates",
    header: "Dates",
    cell: ({ row }) => (
      <span>
        {row.original.submittedDates
          ?.map((dateStr: string) => new Date(dateStr).getDate())
          .sort((a, b) => a - b)
          .join(", ")}
      </span>
    ),
    filterFn: matchDayNumbers,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span>{row.original.gender}</span>,
    filterFn: caseInsensitiveFilter,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span>{row.original.role}</span>,
    filterFn: caseInsensitiveFilter,
  },
  {
    accessorKey: "wtRolePrimary",
    header: "Team Role",
    cell: ({ row }) => <span>{row.original.wtRolePrimary}</span>,
    filterFn: caseInsensitiveFilter,
  },
  {
    accessorKey: "wtRoleSecondary",
    header: "Team Role 2",
    cell: ({ row }) => <span>{row.original.wtRoleSecondary}</span>,
    filterFn: caseInsensitiveFilter,
  },
  {
    accessorKey: "wtRoleSpare",
    header: "Team Role 3",
    cell: ({ row }) => <span>{row.original.wtRoleSpare}</span>,
    filterFn: caseInsensitiveFilter,
  },
];
