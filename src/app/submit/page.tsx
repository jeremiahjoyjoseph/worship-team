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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>

          <main className="space-y-8">
            <div className="text-center md:text-left w-full">
              <TextH3 className="mb-4">Choose a Month</TextH3>
              <p className="text-muted-foreground max-w-[70%] mx-auto lg:mx-0">
                Select the month you want to submit your availability for
              </p>
            </div>

            <div className="max-w-2xl mx-auto md:mx-0">
              <div className="flex justify-center mx-auto lg:justify-start">
                <MonthYearPicker
                  selectedMonth={selectedMonth ?? undefined}
                  onMonthSelect={setSelectedMonth}
                  showMonthChevrons={false}
                  showYearChevrons={true}
                  preventPreviousMonths={true}
                  preventCurrentMonth={true}
                />
              </div>

              {/* Desktop button - hidden on mobile */}
              <div className="mt-8 hidden md:flex justify-center md:justify-start">
                <Link
                  href={
                    selectedMonth
                      ? `/submit/${selectedMonth
                          .toLocaleString("en", {
                            month: "long",
                            year: "numeric",
                          })
                          .replace(/\s+/g, "-")}`
                      : "#"
                  }
                >
                  <Button
                    disabled={!selectedMonth}
                    className="px-8 py-3 text-base"
                  >
                    Next
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile fixed bottom button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <Link
          href={
            selectedMonth
              ? `/submit/${selectedMonth
                  .toLocaleString("en", {
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/\s+/g, "-")}`
              : "#"
          }
          className="block"
        >
          <Button
            disabled={!selectedMonth}
            className="w-full py-4 text-base font-medium"
          >
            Next
          </Button>
        </Link>
      </div>
    </div>
  );
}
