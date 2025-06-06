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
                  id: "",
                  name: "",
                  bandRole: role as BandRole,
                  isMd: false,
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

  const handleUpdateRoster = async (
    location: Location,
    date: string,
    role: string,
    user: IUser
  ) => {
    try {
      setIsLoading(true); // Show loading state during update

      // Create a deep copy of the current data to avoid mutation
      const updatedData = data.map((locationRoster) => {
        if (locationRoster.location !== location) return locationRoster;

        return {
          ...locationRoster,
          dateRosters: locationRoster.dateRosters.map((dateRoster) => {
            if (dateRoster.date !== date) return dateRoster;

            return {
              ...dateRoster,
              worshipTeam: dateRoster.worshipTeam.map((member) =>
                member.bandRole === role
                  ? {
                      id: user._id,
                      name: user.fullName ?? "",
                      bandRole: role as BandRole,
                      isMd: user.md ?? false,
                    }
                  : member
              ),
            };
          }),
        };
      });

      // Update local state immediately for better UX
      setData(updatedData);

      // Update the backend
      const currentRoster = await getRoster(month?.replace(/-/g, " "));
      await updateRoster(month!.replace(/-/g, " "), {
        ...currentRoster,
        submissions: currentRoster.submissions,
        roster: updatedData,
      });
    } catch (err) {
      console.error("Error updating roster:", err);
      // Optionally: Add error handling UI feedback here
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
                  <RosterGrid
                    month={month!}
                    location={location as Location}
                    locationRoster={locationRoster}
                    allLocationRosters={data}
                    submissions={submissions}
                    users={users}
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
