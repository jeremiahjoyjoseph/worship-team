"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "link"
  | "destructive"
  | "secondary"
  | null
  | undefined;

type Month = {
  number: number;
  name: string;
};

const MONTHS: Month[][] = [
  [
    { number: 0, name: "Jan" },
    { number: 1, name: "Feb" },
    { number: 2, name: "Mar" },
    { number: 3, name: "Apr" },
  ],
  [
    { number: 4, name: "May" },
    { number: 5, name: "Jun" },
    { number: 6, name: "Jul" },
    { number: 7, name: "Aug" },
  ],
  [
    { number: 8, name: "Sep" },
    { number: 9, name: "Oct" },
    { number: 10, name: "Nov" },
    { number: 11, name: "Dec" },
  ],
];

interface MonthYearPickerProps {
  selectedMonth?: Date;
  onMonthSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  variant?: {
    calendar?: {
      main?: ButtonVariant;
      selected?: ButtonVariant;
    };
    chevrons?: ButtonVariant;
  };
  className?: string;
  showMonthChevrons?: boolean;
  showYearChevrons?: boolean;
}

export function MonthYearPicker({
  selectedMonth,
  onMonthSelect,
  minDate,
  maxDate,
  disabledDates,
  variant,
  className,
  showMonthChevrons = true,
  showYearChevrons = true,
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const initialYear = selectedMonth?.getFullYear() ?? new Date().getFullYear();
  const [menuYear, setMenuYear] = React.useState(initialYear);

  const disabledDatesMapped = disabledDates?.map((d) => ({
    year: d.getFullYear(),
    month: d.getMonth(),
  }));

  const handlePreviousMonth = () => {
    if (!selectedMonth) return;
    const newDate = subMonths(selectedMonth, 1);
    if (minDate && newDate < minDate) return;
    onMonthSelect?.(newDate);
  };

  const handleNextMonth = () => {
    if (!selectedMonth) return;
    const newDate = addMonths(selectedMonth, 1);
    if (maxDate && newDate > maxDate) return;
    onMonthSelect?.(newDate);
  };

  return (
    <div className="flex items-center gap-2">
      {showMonthChevrons && (
        <Button
          variant={variant?.chevrons ?? "outline"}
          size="icon"
          onClick={handlePreviousMonth}
          disabled={!selectedMonth || (minDate && selectedMonth <= minDate)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !selectedMonth && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedMonth ? (
              format(selectedMonth, "MMMM yyyy")
            ) : (
              <span>Pick a month</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="flex justify-center pt-1 relative items-center">
            <div className="text-sm font-medium">{menuYear}</div>
            {showYearChevrons && (
              <button
                onClick={() => setMenuYear(menuYear - 1)}
                className={cn(
                  buttonVariants({ variant: variant?.chevrons ?? "outline" }),
                  "inline-flex items-center justify-center h-7 w-7 p-0 absolute left-1"
                )}
              >
                <ChevronLeft className="opacity-50 h-4 w-4" />
              </button>
            )}
            {showYearChevrons && (
              <button
                onClick={() => setMenuYear(menuYear + 1)}
                className={cn(
                  buttonVariants({ variant: variant?.chevrons ?? "outline" }),
                  "inline-flex items-center justify-center h-7 w-7 p-0 absolute right-1"
                )}
              >
                <ChevronRight className="opacity-50 h-4 w-4" />
              </button>
            )}
          </div>

          <table className="w-full border-collapse space-y-1">
            <tbody>
              {MONTHS.map((monthRow, i) => (
                <tr key={i} className="flex w-full mt-2">
                  {monthRow.map((m) => {
                    const isDisabled =
                      (maxDate &&
                        (menuYear > maxDate.getFullYear() ||
                          (menuYear === maxDate.getFullYear() &&
                            m.number > maxDate.getMonth()))) ||
                      (minDate &&
                        (menuYear < minDate.getFullYear() ||
                          (menuYear === minDate.getFullYear() &&
                            m.number < minDate.getMonth()))) ||
                      (disabledDatesMapped &&
                        disabledDatesMapped.some(
                          (d) => d.year === menuYear && d.month === m.number
                        ));

                    const isSelected = selectedMonth
                      ? selectedMonth.getMonth() === m.number &&
                        selectedMonth.getFullYear() === menuYear
                      : false;

                    return (
                      <td key={m.number} className="w-1/4 p-1">
                        <button
                          disabled={isDisabled}
                          className={cn(
                            buttonVariants({
                              variant: isSelected
                                ? variant?.calendar?.selected ?? "default"
                                : variant?.calendar?.main ?? "ghost",
                            }),
                            "w-full h-9 text-sm"
                          )}
                          onClick={() => {
                            const newDate = new Date(menuYear, m.number);
                            onMonthSelect?.(newDate);
                            setOpen(false);
                          }}
                        >
                          {m.name}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </PopoverContent>
      </Popover>

      {showMonthChevrons && (
        <Button
          variant={variant?.chevrons ?? "outline"}
          size="icon"
          onClick={handleNextMonth}
          disabled={!selectedMonth || (maxDate && selectedMonth >= maxDate)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
