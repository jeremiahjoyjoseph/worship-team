import { Document } from "mongoose";
import { BandRole, Location } from "./user";

export interface IWorshipTeam {
  id: string;
  name: string;
  wtPrimaryRole: BandRole;
  wtSecondaryRole?: BandRole;
  isMd: boolean;
}

export interface ILocationRoster {
  location: Location;
  worshipTeam: IWorshipTeam[];
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
