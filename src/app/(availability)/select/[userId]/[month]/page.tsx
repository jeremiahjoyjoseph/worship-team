"use client";
import { use, useEffect, useState } from "react";
import { TextH2 } from "../../../../../../components/ui/typography";

import {
  createRoster,
  getRoster,
  submitAvailability,
} from "@/app/api/roster/api";
import { Button } from "@/components/ui/button";
import CheckboxList from "@/components/ui/checkbox-list";
import { ISubmission } from "@/types/roster";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Search(props: {
  params: Promise<{ userId: string; month: string }>;
}) {
  const { userId } = use(props.params);
  const { month } = use(props.params);
  const router = useRouter();
  const [roster, setRoster] = useState();

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [requiredDates, setRequiredDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    if (!month || !userId) return;

    const fetchRosterAndSubmission = async () => {
      try {
        // Step 1: Try to fetch the existing roster
        let rosterData;
        try {
          rosterData = await getRoster(month);
        } catch (error) {
          console.error("Error fetching roster:", error);
        }

        // Step 2: If no roster, create one
        if (
          !rosterData ||
          (Array.isArray(rosterData) && rosterData.length === 0)
        ) {
          try {
            rosterData = await createRoster(month);
          } catch (error) {
            console.error("Error creating roster:", error);
            return; // Exit if we cannot create a roster
          }
        }

        // Step 3: Set the fetched or created roster
        setRoster(rosterData);

        // Step 4: Check if the user has submitted dates
        const submission = rosterData.submissions?.find(
          (sub: ISubmission) => sub.userId === userId
        );
        if (submission && submission.submittedDates?.length) {
          setRequiredDates(rosterData.requiredDates);
          setSelectedDates(submission.submittedDates);
          setHasSubmitted(true);
        } else {
          setHasSubmitted(false);
          if (rosterData?.requiredDates) {
            setRequiredDates(rosterData.requiredDates);
          } else {
            throw new Error("Required dates not available in roster");
          }
        }
      } catch (error) {
        console.error("Error during roster and submission processing:", error);
      }
    };

    fetchRosterAndSubmission();
  }, [month, userId]);

  const onSubmit = async () => {
    try {
      if (!userId || !month || selectedDates.length === 0) {
        throw new Error("User ID, month, and selected dates are required");
      }

      await submitAvailability(userId, month, selectedDates);
      alert("Availability submitted successfully!");
      router.push("/select/thank-you");
      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting availability:", error);
      alert("Failed to submit availability. Please try again.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Go Back
      </Button>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div>
          <TextH2 className="mb-4">Select Your Dates</TextH2>

          <CheckboxList
            items={requiredDates}
            selectedItems={selectedDates}
            onChange={setSelectedDates}
          />
          <Button className="flex justify-center mt-8" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </main>
    </div>
  );
}
