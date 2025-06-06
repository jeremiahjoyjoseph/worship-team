import { Document } from "mongoose";
import { BandRole, Location } from "./user";
import { IUser } from "./user";

export interface IWorshipTeamMember {
  id: string;
  name: string;
  isMd?: boolean;
}

export interface IWorshipTeam {
  bandRole: BandRole;
  members: IWorshipTeamMember[];
}

export interface IDateRoster {
  date: string;
  worshipTeam: IWorshipTeam[];
}

export interface ILocationRoster {
  location: Location;
  dateRosters: IDateRoster[];
}

export interface IEventDate {
  startDate: string;
  endDate: string;
  name: string;
  description?: string;
}

export interface ISubmission {
  userId: string;
  submittedDates: string[];
}

export interface IRoster extends Document {
  name: string;
  month: string;
  requiredDates: string[];
  submissions: ISubmission[];
  roster: ILocationRoster[];
  notes: string[];
  eventDates: IEventDate[];
  createdAt: Date;
  updatedAt: Date;
}

export type AvailabilityUser = IUser & {
  submittedDates: string[];
};
