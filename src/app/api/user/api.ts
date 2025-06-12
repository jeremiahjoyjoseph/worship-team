import { IUser, CreateUserInput } from "@/types/user";

export const getUsers = async () => {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const { success, data } = await response.json();
    if (!success) {
      throw new Error("Failed to fetch users: API returned an error");
    }
    return data; // Return the `data` field containing the users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export async function fetchUser(id: string) {
  try {
    const res = await fetch(`/api/user/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Failed to fetch user");
  }
}

export async function updateUser(id: string, data: Partial<IUser>) {
  try {
    const res = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to update user");
    }
    return res.json();
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Failed to update user");
  }
}

export async function createUsers(users: CreateUserInput | CreateUserInput[]) {
  try {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        users: Array.isArray(users) ? users : [users],
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create user(s)");
    }

    const { success, data, message } = await res.json();

    if (!success) {
      throw new Error(`Failed to create user(s): ${message}`);
    }

    return data;
  } catch (err) {
    console.error("Error creating user(s):", err);
    throw new Error("Failed to create user(s)");
  }
}

export async function deleteUsers(ids: string | string[]) {
  try {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: Array.isArray(ids) ? ids : [ids] }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete user(s)");
    }

    const { success, message } = await res.json();

    if (!success) {
      throw new Error(`Failed to delete user(s): ${message}`);
    }

    return message;
  } catch (err) {
    console.error("Error deleting user(s):", err);
    throw new Error("Failed to delete user(s)");
  }
}
