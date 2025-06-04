import { Document } from "mongoose";
import { BandRole, Location } from "./user";
import { IUser } from "./user";

export interface IWorshipTeam {
  id: string;
  name: string;
  bandRole: BandRole;
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
