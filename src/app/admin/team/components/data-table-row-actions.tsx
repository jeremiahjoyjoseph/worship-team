"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IUser } from "@/types/user";
import React from "react";
import { EditDetailsDialog } from "./edit-details-dialog";
import { ViewDetailsDialog } from "./view-details-dialog";

interface DataTableRowActionsProps<TData extends IUser> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends IUser>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isViewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [isEditDetailsOpen, setEditDetailsOpen] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setViewDetailsOpen(true), 0);
            }}
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setEditDetailsOpen(true), 0);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewDetailsDialog
        row={row}
        open={isViewDetailsOpen}
        setOpen={setViewDetailsOpen}
      />
      <EditDetailsDialog
        row={row}
        open={isEditDetailsOpen}
        setOpen={setEditDetailsOpen}
      />
    </>
  );
}
