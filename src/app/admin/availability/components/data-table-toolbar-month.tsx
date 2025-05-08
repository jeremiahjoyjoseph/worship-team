"use client";

import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { format } from "date-fns";

interface DataTableToolbarMonthProps {
  month: string | undefined;
  setMonth: (date: string | undefined) => void;
}

export function DataTableToolbarMonth({
  month,
  setMonth,
}: DataTableToolbarMonthProps & { month: string | undefined }) {
  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "MMMM-yyyy");
      setMonth(formattedDate);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <MonthYearPicker
          onMonthSelect={onDateSelect}
          selectedMonth={month ? new Date(month) : undefined}
        />
      </div>
    </div>
  );
}
