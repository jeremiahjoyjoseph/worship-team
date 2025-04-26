"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface DataTableToolbarProps {
  month: string | undefined;
  setMonth: (date: string | undefined) => void;
}

export function DataTableToolbar({
  month,
  setMonth,
}: DataTableToolbarProps & { month: string | undefined }) {
  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "MMMM-yyyy");
      setMonth(formattedDate);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DatePicker
          setDate={onDateSelect}
          date={month ? new Date(`${month}-01`) : undefined}
        />
      </div>
    </div>
  );
}
