import moment from "moment";

// Helper: Get all Sundays for a given "MMMM YYYY" string
export function getAllSundays(monthYear: string): string[] {
  const sundays: string[] = [];
  let date = moment(`1 ${monthYear}`, "D MMMM YYYY");

  const month = date.format("MMMM");
  const year = date.format("YYYY");

  const monthIndex = moment().month(month).month();
  date = moment(`${year}-${monthIndex + 1}-01`, "YYYY-MM-DD");

  while (date.month() === monthIndex) {
    if (date.day() === 0) {
      sundays.push(date.format("D MMMM YYYY"));
    }
    date.add(1, "days");
  }

  return sundays;
}

export function getDateOptionsFromSundays(monthYear: string) {
  const month = monthYear.replaceAll(/-/g, " ");
  const sundays = getAllSundays(month); // e.g., ["2 June 2025", "9 June 2025", ...]
  return sundays.map((dateStr) => {
    const day = new Date(dateStr).getDate().toString();
    return { label: day, value: day };
  });
}
