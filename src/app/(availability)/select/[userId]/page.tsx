"use client";
import { use, useState } from "react";
import { TextH3 } from "../../../../../components/ui/typography";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Search(props: { params: Promise<{ userId: string }> }) {
  const { userId } = use(props.params);
  const router = useRouter();
  const [month, setMonth] = useState<string>(""); // State for selected month

  const getMonths = () => {
    const formatter = new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
    });
    const now = new Date();
    return [0, 1, 2].map((offset) => {
      const date = new Date(now.getFullYear(), now.getMonth() + offset);
      return formatter.format(date);
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Go Back
      </Button>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <TextH3 className="text-center sm:text-left">{`Choose a month!`}</TextH3>
        <Select value={month} onValueChange={(value) => setMonth(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {getMonths().map((month) => (
                <SelectItem value={month} key={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Link href={`/select/${userId}/${month.replace(/\s+/g, "-")}`}>
          <Button>Next</Button>
        </Link>
      </main>
    </div>
  );
}
