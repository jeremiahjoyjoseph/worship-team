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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>

          <main className="space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Select Your Name
              </h1>
              <p className="text-muted-foreground mt-2">
                Choose your name from the list below to submit your availability
              </p>
            </div>

            <div className="max-w-2xl mx-auto md:mx-0">
              <Command className="rounded-lg border shadow-md w-full">
                <CommandInput
                  placeholder="Search by name..."
                  onValueChange={(value) => setQuery(value)}
                  value={query}
                  className="h-12 text-base"
                />

                {query && (
                  <CommandList className="max-h-80">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {users.map((user) => (
                      <CommandItem key={user.id} className="p-2">
                        <Link
                          href={`/submit/${month}/${user.id}`}
                          className="flex w-full items-center"
                        >
                          <p className="flex-grow text-base">
                            {user.full_name}
                          </p>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandList>
                )}
              </Command>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
