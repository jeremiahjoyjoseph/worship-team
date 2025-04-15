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
