"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import * as React from "react";

import { getUsers } from "@/app/api/user/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/types/user";
import { columns } from "./components/columns";
import { DataTablePagination } from "./components/data-pagination";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { UserTableContext } from "./context/user-table-context";
import { ViewDetailsDialog } from "./components/view-details-dialog";

export default function Team() {
  const [data, setData] = React.useState<IUser[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<Row<IUser> | null>(null);
  const [isViewDetailsOpen, setViewDetailsOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  React.useEffect(() => {
    getUsers()
      .then((users) => {
        const sortedUsers: IUser[] = users.sort((a: IUser, b: IUser) =>
          (a.full_name ?? "").localeCompare(b.full_name ?? "")
        );
        setData(sortedUsers);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setIsLoading(false));
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

  const updateRow = React.useCallback((updatedUser: IUser) => {
    setData((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  }, []);

  return (
    <UserTableContext.Provider value={{ updateRow }}>
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
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedRow(row);
                        setViewDetailsOpen(true);
                      }}
                    >
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
                      No users found.
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

        {selectedRow && (
          <ViewDetailsDialog
            row={selectedRow}
            open={isViewDetailsOpen}
            setOpen={setViewDetailsOpen}
          />
        )}
      </div>
    </UserTableContext.Provider>
  );
}
