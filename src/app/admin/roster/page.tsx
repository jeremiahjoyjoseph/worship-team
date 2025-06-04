"use client";
import { getRoster, updateRosterTemplate } from "@/app/api/roster/api";
import { ILocationRoster } from "@/types/roster";
import React from "react";
import { DataTableToolbarMonth } from "./components/data-table-toolbar-month";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LOCATIONS } from "@/constants/location";
import { RosterGrid } from "./components/roster-grid";
import { getAllSundays } from "@/util/date-utils";
import { Location, BandRole } from "@/types/user";
import { BAND_ROLES } from "@/constants/band-roles";
import { IUser } from "@/types/user";

export default function Roster() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<ILocationRoster[]>([]);
  const [month, setMonth] = React.useState<string | undefined>(() => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  });

  React.useEffect(() => {
    async function fetchRoster() {
      try {
        const roster = await getRoster(month);
        if (roster.roster) {
          setData(roster.roster);
        } else {
          // Create template for roster.roster based on schema LocationRosterSchema
          const templateRoster = LOCATIONS.map((location) => ({
            location: location as Location,
            dateRosters: getAllSundays(month!).map((date) => ({
              date,
              worshipTeam: BAND_ROLES.map((role) => ({
                id: "",
                name: "",
                bandRole: role as BandRole,
                isMd: false,
              })),
            })),
          }));

          // Update the roster with the template
          await updateRosterTemplate(month!, templateRoster);
          setData(templateRoster);
        }
      } catch (err) {
        console.error("Error fetching roster data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoster();
  }, [month]);

  const handleUpdateRoster = async (
    location: Location,
    date: string,
    role: string,
    user: IUser
  ) => {
    console.log(location, date, role, user);
  };

  return (
    <div className="w-[100vw] pb-10">
      <div className="mt-8 px-8">
        <DataTableToolbarMonth month={month} setMonth={setMonth} />
      </div>

      <div className="mt-4 px-8">
        <Tabs defaultValue={LOCATIONS[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {LOCATIONS.map((location) => (
              <TabsTrigger
                key={location}
                value={location}
                className="capitalize"
              >
                {location}
              </TabsTrigger>
            ))}
          </TabsList>
          {LOCATIONS.map((location) => {
            const locationRoster = data.find(
              (r) => r.location === location
            ) ?? {
              location: location as Location,
              dateRosters: [],
            };
            return (
              <TabsContent key={location} value={location}>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  <RosterGrid
                    month={month!}
                    location={location as Location}
                    locationRoster={locationRoster}
                    onUpdate={(date, role, user) =>
                      handleUpdateRoster(location as Location, date, role, user)
                    }
                  />
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
