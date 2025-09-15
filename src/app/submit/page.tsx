"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextH3 } from "../../../components/ui/typography";
import { MonthYearPicker } from "@/components/ui/month-year-picker";

export default function SubmitMonth() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null); // State for selected month

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Go Back
      </Button>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[500px]">
        <TextH3 className="text-center sm:text-left">{`Choose a month!`}</TextH3>
        <MonthYearPicker
          selectedMonth={selectedMonth ?? undefined}
          onMonthSelect={setSelectedMonth}
          showMonthChevrons={false}
          showYearChevrons={false}
        />
        <Link
          href={
            selectedMonth
              ? `/submit/${selectedMonth
                  .toLocaleString("en", { month: "long", year: "numeric" })
                  .replace(/\s+/g, "-")}`
              : "#"
          }
        >
          <Button disabled={!selectedMonth}>Next</Button>
        </Link>
      </main>
    </div>
  );
}
