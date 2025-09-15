"use client";
import { use, useEffect, useState } from "react";
import { TextH2 } from "../../../../../components/ui/typography";

import {
  createRoster,
  getRoster,
  submitAvailability,
} from "@/app/api/roster/api";
import { Button } from "@/components/ui/button";
import CheckboxList from "@/components/ui/checkbox-list";
import { Skeleton } from "@/components/ui/skeleton";
import { ISubmission } from "@/types/roster";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Search(props: {
  params: Promise<{ userId: string; month: string }>;
}) {
  const { userId } = use(props.params);
  const { month } = use(props.params);
  const router = useRouter();

  const [requiredDates, setRequiredDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!month || !userId) return;

    const fetchRosterAndSubmission = async () => {
      try {
        setIsLoading(true);

        // Step 1: Try to fetch the existing roster
        let rosterData = await getRoster(month);

        // Step 2: If no roster, create one
        if (!rosterData) {
          try {
            rosterData = await createRoster(month);
          } catch (error) {
            // If roster already exists error, try to fetch it again
            if (
              error instanceof Error &&
              error.message.includes("already exists")
            ) {
              try {
                rosterData = await getRoster(month);
              } catch (fetchError) {
                console.error("Error fetching existing roster:", fetchError);
                return;
              }
            } else {
              console.error("Error creating roster:", error);
              return; // Exit if we cannot create a roster
            }
          }
        }

        // Step 3: Check if the user has submitted dates
        const submission = rosterData.submissions?.find(
          (sub: ISubmission) => sub.user_id === userId
        );

        if (submission && submission.submitted_dates?.length) {
          setRequiredDates(rosterData.required_dates);
          setSelectedDates(submission.submitted_dates);
        } else {
          if (rosterData?.required_dates) {
            setRequiredDates(rosterData.required_dates);
          } else {
            console.error("Required dates not available in roster");
            throw new Error("Required dates not available in roster");
          }
        }
      } catch (error) {
        console.error("Error during roster and submission processing:", error);
      } finally {
        setIsLoading(false);
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
      router.push("/submit/thank-you");
    } catch (error) {
      console.error("Error submitting availability:", error);
      alert("Failed to submit availability. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>

          <main className="space-y-8">
            <div className="text-center md:text-left">
              <TextH2 className="mb-4">Select Your Available Dates</TextH2>
              <p className="text-muted-foreground">
                Please select all the dates you are available for worship team
                service
              </p>
            </div>

            <div className="max-w-3xl mx-auto md:mx-0">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Skeleton className="h-6 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 rounded-md"
                      >
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <CheckboxList
                    items={requiredDates}
                    selectedItems={selectedDates}
                    onChange={setSelectedDates}
                  />

                  {/* Desktop button - hidden on mobile */}
                  <div className="mt-8 hidden md:flex justify-center md:justify-start">
                    <Button
                      className="w-full md:w-auto px-8 py-3 text-base"
                      onClick={onSubmit}
                      disabled={selectedDates.length === 0}
                    >
                      Submit Availability
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile fixed bottom button */}
      {!isLoading && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <Button
            className="w-full py-4 text-base font-medium"
            onClick={onSubmit}
            disabled={selectedDates.length === 0}
          >
            Submit Availability
          </Button>
        </div>
      )}
    </div>
  );
}
