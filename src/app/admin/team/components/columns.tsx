import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/user";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <span>{row.original.full_name || "N/A"}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span>{row.original.role}</span>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
