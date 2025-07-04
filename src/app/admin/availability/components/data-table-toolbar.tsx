"use client";

import { Button } from "@/components/ui/button";
import { USER_ROLES_OPTIONS } from "@/constants/role";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { BAND_ROLES_OPTIONS } from "@/constants/band-roles";
import { getDateOptionsFromSundays } from "@/util/date-utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  month: string | undefined;
}

export function DataTableToolbar<TData>({
  table,
  month,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("submittedDates") && (
          <DataTableFacetedFilter
            column={table.getColumn("submittedDates")}
            title="Dates"
            options={getDateOptionsFromSundays(month ?? "")}
          />
        )}
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={USER_ROLES_OPTIONS}
          />
        )}
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table.getColumn("gender")}
            title="Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />
        )}
        {table.getColumn("wtRolePrimary") && (
          <DataTableFacetedFilter
            column={table.getColumn("wtRolePrimary")}
            title="WT Role"
            options={BAND_ROLES_OPTIONS}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
