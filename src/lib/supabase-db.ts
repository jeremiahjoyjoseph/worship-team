import { supabase } from "./supabase";
import { IUser, CreateUserInput } from "@/types/user";
import { IRoster } from "@/types/roster";

// User operations
export const userService = {
  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get user by ID
  async getUserById(id: string): Promise<IUser | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw error;
    }
    return data;
  },

  // Create user
  async createUser(userData: CreateUserInput): Promise<IUser> {
    const fullName =
      userData.fullName ||
      `${userData.firstName}${
        userData.middleName ? ` ${userData.middleName}` : ""
      }${userData.lastName ? ` ${userData.lastName}` : ""}`;

    const { data, error } = await supabase
      .from("users")
      .insert({
        first_name: userData.firstName,
        middle_name: userData.middleName,
        last_name: userData.lastName,
        full_name: fullName,
        nickname: userData.nickname,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        gender: userData.gender,
        dob: userData.dob,
        md: userData.md || false,
        status: userData.status || "active",
        wt_role_primary: userData.wtRolePrimary,
        wt_role_secondary: userData.wtRoleSecondary,
        wt_role_spare: userData.wtRoleSpare,
        all_band_roles: userData.allBandRoles || false,
        location_primary: userData.locationPrimary,
        location_secondary: userData.locationSecondary,
        location_spare: userData.locationSpare,
        all_locations: userData.allLocations || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create multiple users
  async createUsers(usersData: CreateUserInput[]): Promise<IUser[]> {
    const processedUsers = usersData.map((userData) => {
      const fullName =
        userData.fullName ||
        `${userData.firstName}${
          userData.middleName ? ` ${userData.middleName}` : ""
        }${userData.lastName ? ` ${userData.lastName}` : ""}`;

      return {
        first_name: userData.firstName,
        middle_name: userData.middleName,
        last_name: userData.lastName,
        full_name: fullName,
        nickname: userData.nickname,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        gender: userData.gender,
        dob: userData.dob,
        md: userData.md || false,
        status: userData.status || "active",
        wt_role_primary: userData.wtRolePrimary,
        wt_role_secondary: userData.wtRoleSecondary,
        wt_role_spare: userData.wtRoleSpare,
        all_band_roles: userData.allBandRoles || false,
        location_primary: userData.locationPrimary,
        location_secondary: userData.locationSecondary,
        location_spare: userData.locationSpare,
        all_locations: userData.allLocations || false,
      };
    });

    const { data, error } = await supabase
      .from("users")
      .insert(processedUsers)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Update user
  async updateUser(
    id: string,
    userData: Partial<CreateUserInput>
  ): Promise<IUser> {
    const updateData: Record<string, unknown> = {};

    if (userData.firstName) updateData.first_name = userData.firstName;
    if (userData.middleName !== undefined)
      updateData.middle_name = userData.middleName;
    if (userData.lastName) updateData.last_name = userData.lastName;
    if (userData.fullName) updateData.full_name = userData.fullName;
    if (userData.nickname !== undefined)
      updateData.nickname = userData.nickname;
    if (userData.username) updateData.username = userData.username;
    if (userData.email) updateData.email = userData.email;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.role) updateData.role = userData.role;
    if (userData.gender) updateData.gender = userData.gender;
    if (userData.dob !== undefined) updateData.dob = userData.dob;
    if (userData.md !== undefined) updateData.md = userData.md;
    if (userData.status) updateData.status = userData.status;
    if (userData.wtRolePrimary !== undefined)
      updateData.wt_role_primary = userData.wtRolePrimary;
    if (userData.wtRoleSecondary !== undefined)
      updateData.wt_role_secondary = userData.wtRoleSecondary;
    if (userData.wtRoleSpare !== undefined)
      updateData.wt_role_spare = userData.wtRoleSpare;
    if (userData.allBandRoles !== undefined)
      updateData.all_band_roles = userData.allBandRoles;
    if (userData.locationPrimary !== undefined)
      updateData.location_primary = userData.locationPrimary;
    if (userData.locationSecondary !== undefined)
      updateData.location_secondary = userData.locationSecondary;
    if (userData.locationSpare !== undefined)
      updateData.location_spare = userData.locationSpare;
    if (userData.allLocations !== undefined)
      updateData.all_locations = userData.allLocations;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  },

  // Delete multiple users
  async deleteUsers(ids: string[]): Promise<void> {
    const { error } = await supabase.from("users").delete().in("id", ids);

    if (error) throw error;
  },

  // Check if user exists by email or username
  async checkUserExists(email: string, username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) || false;
  },
};

// Roster operations
export const rosterService = {
  // Get all rosters
  async getAllRosters(): Promise<IRoster[]> {
    const { data, error } = await supabase
      .from("rosters")
      .select(
        `
        *,
        roster_submissions (
          user_id,
          submitted_dates
        ),
        roster_locations (
          location,
          roster_dates (
            date,
            worship_teams (
              band_role,
              worship_team_members (
                user_id,
                name,
                is_md
              )
            )
          )
        ),
        event_dates (
          start_date,
          end_date,
          name,
          description
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get roster by ID
  async getRosterById(id: string): Promise<IRoster | null> {
    const { data, error } = await supabase
      .from("rosters")
      .select(
        `
        *,
        roster_submissions (
          user_id,
          submitted_dates
        ),
        roster_locations (
          location,
          roster_dates (
            date,
            worship_teams (
              band_role,
              worship_team_members (
                user_id,
                name,
                is_md
              )
            )
          )
        ),
        event_dates (
          start_date,
          end_date,
          name,
          description
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },

  // Get roster by month
  async getRosterByMonth(month: string): Promise<IRoster | null> {
    const { data, error } = await supabase
      .from("rosters")
      .select(
        `
        *,
        roster_submissions (
          user_id,
          submitted_dates
        ),
        roster_locations (
          location,
          roster_dates (
            date,
            worship_teams (
              band_role,
              worship_team_members (
                user_id,
                name,
                is_md
              )
            )
          )
        ),
        event_dates (
          start_date,
          end_date,
          name,
          description
        )
      `
      )
      .eq("month", month)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },

  // Create roster
  async createRoster(rosterData: {
    name?: string;
    month: string;
    requiredDates: string[];
    notes?: string[];
  }): Promise<IRoster> {
    const { data, error } = await supabase
      .from("rosters")
      .insert({
        name: rosterData.name,
        month: rosterData.month,
        required_dates: rosterData.requiredDates,
        notes: rosterData.notes || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update roster
  async updateRoster(
    id: string,
    rosterData: Partial<IRoster>
  ): Promise<IRoster> {
    const updateData: Record<string, unknown> = {};

    if (rosterData.name !== undefined) updateData.name = rosterData.name;
    if (rosterData.month) updateData.month = rosterData.month;
    if (rosterData.required_dates)
      updateData.required_dates = rosterData.required_dates;
    if (rosterData.notes !== undefined) updateData.notes = rosterData.notes;

    const { data, error } = await supabase
      .from("rosters")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete roster
  async deleteRoster(id: string): Promise<void> {
    const { error } = await supabase.from("rosters").delete().eq("id", id);

    if (error) throw error;
  },

  // Delete roster by month
  async deleteRosterByMonth(month: string): Promise<void> {
    const { error } = await supabase
      .from("rosters")
      .delete()
      .eq("month", month);

    if (error) throw error;
  },
};
