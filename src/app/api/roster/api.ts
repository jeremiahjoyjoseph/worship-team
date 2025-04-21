export const getRoster = async (month?: string) => {
  try {
    if (!month) {
      throw new Error("You need to pass a month");
    }

    const response = await fetch(
      `/api/roster?month=${encodeURIComponent(month)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch roster");
    }

    const { success, data, message } = await response.json();

    if (!success) {
      throw new Error(`Failed to fetch roster: ${message}`);
    }

    if (data && data.length) return data[0];
  } catch (error) {
    console.error("Error fetching roster:", error);
    throw error;
  }
};

export const getAllRosters = async () => {
  try {
    const response = await fetch(`/api/roster`);

    if (!response.ok) {
      throw new Error("Failed to fetch rosters");
    }

    const { success, data, message } = await response.json();

    if (!success) {
      throw new Error(`Failed to fetch roster: ${message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching roster:", error);
    throw error;
  }
};

export const createRoster = async (month?: string) => {
  try {
    if (!month) {
      throw new Error("You need to pass a month in 'MMMM YYYY' format");
    }

    const response = await fetch("/api/roster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ month: month.replaceAll("-", " ") }),
    });

    const { success, data, message } = await response.json();

    if (!response.ok) {
      throw new Error(message || "Failed to create roster");
    }

    if (!success) {
      throw new Error(`Failed to create roster: ${message}`);
    }

    if (data && data.length) return data[0];
  } catch (error) {
    console.error("Error creating roster:", error);
    throw error;
  }
};

export const getSubmittedDates = async (userId?: string, month?: string) => {
  try {
    if (!userId || !month) {
      throw new Error("You need to pass both userId and month");
    }

    const response = await fetch(
      `/api/roster/${encodeURIComponent(userId)}?month=${encodeURIComponent(
        month
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch submitted dates");
    }

    const { success, data, message } = await response.json();

    if (!success) {
      throw new Error(`Failed to fetch submitted dates: ${message}`);
    }

    return data; // userSubmission.submittedDates
  } catch (error) {
    console.error("Error fetching submitted dates:", error);
    throw error;
  }
};
