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

// Supabase User type
export interface IUser {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  full_name?: string;
  nickname?: string;
  username: string;
  email: string;
  phone: string;
  created_at: string;
  role: Role;
  last_login_date?: string;
  wt_role_primary?: BandRole;
  wt_role_secondary?: BandRole | "";
  wt_role_spare?: BandRole | "";
  all_band_roles?: boolean;
  gender: "male" | "female";
  dob?: string;
  md?: boolean;
  status: "active" | "inactive";
  location_primary?: Location;
  location_secondary?: Location | "";
  location_spare?: Location | "";
  all_locations?: boolean;
  slug?: string;
  reset_password_token?: string;
  reset_password_expire?: string;
  updated_at?: string;
}

// Type for user response (without password)
export interface UserResponse extends Omit<IUser, "password"> {
  password?: string;
}
