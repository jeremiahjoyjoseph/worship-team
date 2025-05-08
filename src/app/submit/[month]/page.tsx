"use client";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { getUsers } from "@/app/api/user/api";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function SubmitUser(props: {
  params: Promise<{ month: string }>;
}) {
  const { month } = use(props.params);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Go Back
      </Button>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[500px]">
        <Command className="rounded-lg border shadow-md w-full">
          <CommandInput
            placeholder="Name"
            onValueChange={(value) => setQuery(value)}
            value={query}
          />

          {query && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {users.map((user) => (
                <CommandItem key={user._id}>
                  <Link
                    href={`/submit/${month}/${user._id}`}
                    className="flex w-full"
                  >
                    <span className="flex-grow">{user.fullName}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </main>
    </div>
  );
}
