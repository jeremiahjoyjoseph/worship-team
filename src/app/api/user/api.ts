import { IUser } from "@/types/user";

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
