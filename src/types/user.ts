import { Document } from "mongoose";

export enum Role {
  ADMIN = "admin",
  WORSHIP_PASTOR = "worship-pastor",
  WORSHIP_LEADER = "worship-leader",
  WORSHIP_TEAM_MEMBER = "worship-team-member",
  MEDIA_TEAM = "media-team",
  SOUND_TEAM = "sound-team",
  GUEST = "guest",
}

export enum BandRole {
  VOCALS = "vocals",
  DRUMS = "drums",
  KEYS = "keys",
  ACOUSTIC = "acoustic",
  BASS = "bass",
  ELECTRIC = "electric",
}

export enum Location {
  CENTRAL = "central",
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
}

// Type for creating a new user
export interface CreateUserInput {
  firstName: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  nickname?: string;
  username: string;
  email: string;
  phone: string;
  role: Role;
  gender: "male" | "female";
  dob?: string;
  md?: boolean;
  status: "active" | "inactive";
  wtRolePrimary?: BandRole;
  wtRoleSecondary?: BandRole | "";
  wtRoleSpare?: BandRole | "";
  allBandRoles?: boolean;
  locationPrimary?: Location;
  locationSecondary?: Location | "";
  locationSpare?: Location | "";
  allLocations?: boolean;
}

// Type for user response (without password)
export interface UserResponse extends Omit<IUser, "password"> {
  password?: string;
}

export interface IUser extends Document {
  firstName: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  nickname?: string;
  username: string;
  email: string;
  phone: string;
  createdAt: Date;
  role: Role;
  lastLogInDate?: Date;
  wtRolePrimary?: BandRole;
  wtRoleSecondary?: BandRole | "";
  wtRoleSpare?: BandRole | "";
  allBandRoles?: boolean;
  gender: "male" | "female";
  dob?: string;
  md?: boolean;
  status: "active" | "inactive";
  locationPrimary?: Location;
  locationSecondary?: Location | "";
  locationSpare?: Location | "";
  allLocations?: boolean;
  slug?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  updatedAt?: Date;
  _id: string;
}
