import { AvailabilityUser } from "@/types/roster";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AvailabilityUser>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <span>{row.original.fullName || "N/A"}</span>,
  },
  {
    accessorKey: "dates",
    header: "Dates",
    cell: ({ row }) => (
      <span>
        {row.original.submittedDates
          ?.map((dateStr: string) => {
            const day = new Date(dateStr).getDate();
            return day;
          })
          .join(", ")}
      </span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span>{row.original.gender}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span>{row.original.role}</span>,
  },
  {
    accessorKey: "team-role",
    header: "Team Role",
    cell: ({ row }) => <span>{row.original.wtRolePrimary}</span>,
  },
  {
    accessorKey: "team-role-2",
    header: "Team Role 2",
    cell: ({ row }) => <span>{row.original.wtRoleSecondary}</span>,
  },
  {
    accessorKey: "team-role-3",
    header: "Team Role 3",
    cell: ({ row }) => <span>{row.original.wtRoleSpare}</span>,
  },
];
