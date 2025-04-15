"use client";
import { use, useEffect, useState } from "react";
import { TextH2 } from "../../../../components/ui/typography";
import { fetchUser } from "@/app/api/user/[id]/api";
import { IUser } from "@/types/user";

export default function Search(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser(id); // 👈 use the imported function
        setUser(userData);
      } catch (err) {
        console.log("err", err);
      }
    };

    getUser();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <TextH2 className="text-center sm:text-left">
          {`Select Your Month and Dates: ${id}`}
        </TextH2>
      </main>
    </div>
  );
}
