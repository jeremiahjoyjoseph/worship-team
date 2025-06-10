import { IWorshipTeam, ISubmission, ILocationRoster } from "@/types/roster";
import { Column, ColumnDef } from "@tanstack/react-table";
import { RosterCell } from "./roster-cell";
import { IUser, Location } from "@/types/user";
import { Row } from "@tanstack/react-table";
import { BAND_ROLES } from "@/constants/band-roles";

export interface TableData {
  date: string;
  dateStr: string;
  worshipTeam: IWorshipTeam[];
}

export function createColumns(
  submissions: ISubmission[],
  users: IUser[],
  allLocationRosters: ILocationRoster[],
  location: Location,
  month: string,
  onRosterUpdate: (updatedRoster: ILocationRoster[]) => void
): ColumnDef<TableData>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
    },
    ...BAND_ROLES.map((role) => ({
      accessorKey: role,
      header: role.charAt(0).toUpperCase() + role.slice(1),
      cell: ({
        row,
        column,
      }: {
        row: Row<TableData>;
        column: Column<TableData>;
      }) => {
        const dateStr = row.original.dateStr;
        const worshipTeam = row.original.worshipTeam;

        return (
          <RosterCell
            date={dateStr}
            role={role}
            colId={column.id}
            worshipTeam={worshipTeam}
            submissions={submissions}
            allLocationRosters={allLocationRosters}
            location={location}
            month={month}
            onRosterUpdate={onRosterUpdate}
            users={users}
          />
        );
      },
    })),
  ];
}
