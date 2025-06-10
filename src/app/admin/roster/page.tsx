"use client";
import { getRoster, updateRoster } from "@/app/api/roster/api";
import { getUsers } from "@/app/api/user/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BAND_ROLES } from "@/constants/band-roles";
import { LOCATIONS } from "@/constants/location";
import { IDateRoster, ILocationRoster } from "@/types/roster";
import { BandRole, IUser, Location } from "@/types/user";
import { getAllSundays } from "@/util/date-utils";
import React from "react";
import { DataTableToolbarMonth } from "./components/data-table-toolbar-month";
import { RosterGrid } from "./components/roster-grid";
import { AvailableUsersList } from "./components/available-users-list";
import { SettingsProvider } from "./context/settings-context";
import { SettingsDropdown } from "./components/settings-dropdown";

export default function Roster() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<ILocationRoster[]>([]);
  const [submissions, setSubmissions] = React.useState([]);
  const [month, setMonth] = React.useState<string | undefined>(() => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  });
  const [users, setUsers] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    async function fetchRoster() {
      try {
        setIsLoading(true);
        const roster = await getRoster(month?.replace(/-/g, " "));
        const users = await getUsers();
        setUsers(users);
        setSubmissions(roster.submissions);
        if (roster.roster && roster.roster.length > 0) {
          setData(roster.roster);
        } else {
          // Create template for roster.roster based on schema LocationRosterSchema
          const templateRoster = LOCATIONS.map((location) => ({
            location: location as Location,
            dateRosters: getAllSundays(month!.replace(/-/g, " ")).map(
              (date) => ({
                date,
                worshipTeam: BAND_ROLES.map((role) => ({
                  bandRole: role as BandRole,
                  members: [],
                })),
              })
            ),
          }));

          // Update the roster with the template
          await updateRoster(month!.replace(/-/g, " "), {
            ...roster,
            roster: templateRoster,
          });
          setData(templateRoster);
        }
      } catch (err) {
        console.error("Error fetching roster data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (month) {
      fetchRoster();
    }
  }, [month]);

  const handleRosterUpdate = async (updatedRoster: ILocationRoster[]) => {
    try {
      setIsLoading(true);
      setData(updatedRoster);

      const currentRoster = await getRoster(month?.replace(/-/g, " "));
      await updateRoster(month!.replace(/-/g, " "), {
        ...currentRoster,
        submissions: currentRoster.submissions,
        roster: updatedRoster,
      });
    } catch (err) {
      console.error("Error updating roster:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const locationRosterMap = React.useMemo(() => {
    const map = new Map<
      Location,
      { location: Location; dateRosters: IDateRoster[] }
    >();
    data.forEach((entry) => {
      map.set(entry.location, {
        location: entry.location,
        dateRosters: entry.dateRosters || [],
      });
    });
    return map;
  }, [data]);

  return (
    <SettingsProvider>
      <div className="w-[calc(100vw-32px)] pb-10">
        <div className="mt-8 px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Roster Management</h1>
            <SettingsDropdown />
          </div>
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
              const locationRoster = locationRosterMap.get(
                location as Location
              ) ?? {
                location: location as Location,
                dateRosters: [],
              };
              return (
                <TabsContent key={location} value={location}>
                  {isLoading ? (
                    <p className="text-muted-foreground">Loading...</p>
                  ) : (
                    <>
                      <RosterGrid
                        month={month!}
                        location={location as Location}
                        locationRoster={locationRoster}
                        allLocationRosters={data}
                        submissions={submissions}
                        users={users}
                        onRosterUpdate={handleRosterUpdate}
                      />
                      <AvailableUsersList
                        users={users}
                        submissions={submissions}
                        location={location as Location}
                      />
                    </>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </SettingsProvider>
  );
}
