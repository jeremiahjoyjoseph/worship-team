import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Roster from "@/models/roster";
import moment from "moment";
import { ISubmission } from "@/types/roster";

// Helper: Get all Sundays for a given "MMMM YYYY" string
function getAllSundays(monthYear: string): string[] {
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

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { month } = body;

    const inputDate = moment(month, "MMMM YYYY", true);

    // Validate format
    if (!inputDate.isValid()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The month must be in the format MMMM YYYY. Example: February 2024",
        },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existingRoster = await Roster.findOne({ month });
    if (existingRoster) {
      return NextResponse.json(
        {
          success: false,
          message: "A roster for this month already exists.",
          data: existingRoster,
        },
        { status: 400 }
      );
    }

    const submissions: ISubmission[] = [];
    const requiredDates = getAllSundays(month);

    const rosterData = {
      ...body,
      submissions,
      requiredDates,
    };

    try {
      const roster = await Roster.create(rosterData);

      return NextResponse.json({
        success: true,
        message: "Roster has been generated",
        data: roster,
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err as { code?: number }).code === 11000) {
        return NextResponse.json(
          { success: false, message: "This month already exists." },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error generating roster:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate roster." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const month = searchParams.get("month")?.replace(/-/g, " ");

    await connectToDatabase();

    let roster;
    if (id) {
      roster = await Roster.findById(id);
    } else if (month) {
      roster = await Roster.find({ month });
    } else {
      roster = await Roster.find();
    }

    if (roster && (Array.isArray(roster) ? roster.length > 0 : true)) {
      return NextResponse.json({
        success: true,
        message: "Here is the roster",
        data: roster,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Roster not available" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching roster:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch roster." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const rosterId = searchParams.get("rosterId");
  const month = searchParams.get("month")?.replace(/-/g, " ");

  await connectToDatabase();

  try {
    let deleted;
    if (rosterId) {
      deleted = await Roster.findByIdAndDelete(rosterId);
    } else if (month) {
      deleted = await Roster.findOneAndDelete({ month });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Either rosterId or month must be provided",
        },
        { status: 400 }
      );
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Roster has been deleted",
    });
  } catch (error) {
    console.error("Error deleting roster:", error);
    return NextResponse.json(
      { success: false, message: "Roster deletion failed" },
      { status: 500 }
    );
  }
}
