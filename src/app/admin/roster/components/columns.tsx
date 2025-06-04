import { IWorshipTeam } from "@/types/roster";
import { ColumnDef } from "@tanstack/react-table";
import { RosterCell } from "./roster-cell";
import { IUser } from "@/types/user";
import { Row } from "@tanstack/react-table";
import { BAND_ROLES } from "@/constants/band-roles";

export interface TableData {
  date: string;
  dateStr: string;
  worshipTeam: IWorshipTeam[];
}

export function createColumns(
  onUpdate: (date: string, role: string, user: IUser) => void
): ColumnDef<TableData>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
    },
    ...BAND_ROLES.map((role) => ({
      accessorKey: role,
      header: role.charAt(0).toUpperCase() + role.slice(1),
      cell: ({ row }: { row: Row<TableData> }) => {
        const dateStr = row.original.dateStr;
        const worshipTeam = row.original.worshipTeam;
        return (
          <RosterCell
            date={dateStr}
            role={role}
            worshipTeam={worshipTeam}
            onUpdate={onUpdate}
          />
        );
      },
    })),
  ];
}
