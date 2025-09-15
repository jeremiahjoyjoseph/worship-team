import { BandRole, Location } from "./user";
import { IUser } from "./user";

export interface IWorshipTeamMember {
  id: string;
  name: string;
  is_md?: boolean;
}

export interface IWorshipTeam {
  band_role: BandRole;
  members: IWorshipTeamMember[];
}

export interface IDateRoster {
  date: string;
  worship_team: IWorshipTeam[];
}

export interface ILocationRoster {
  location: Location;
  date_rosters: IDateRoster[];
}

export interface IEventDate {
  start_date: string;
  end_date: string;
  name: string;
  description?: string;
}

export interface ISubmission {
  user_id: string;
  submitted_dates: string[];
}

export interface IRoster {
  id: string;
  name: string;
  month: string;
  required_dates: string[];
  submissions: ISubmission[];
  roster: ILocationRoster[];
  notes: string[];
  event_dates: IEventDate[];
  created_at: string;
  updated_at: string;
}

export type AvailabilityUser = IUser & {
  submitted_dates: string[];
};
