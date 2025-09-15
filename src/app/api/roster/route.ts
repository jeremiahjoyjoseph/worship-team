import { NextResponse } from "next/server";
import { rosterService } from "@/lib/supabase-db";
import moment from "moment";
import { getAllSundays } from "@/util/date-utils";

export async function POST(req: Request) {
  try {
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
    const existingRoster = await rosterService.getRosterByMonth(month);
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

    const requiredDates = getAllSundays(month);

    const rosterData = {
      ...body,
      requiredDates,
    };

    const roster = await rosterService.createRoster(rosterData);

    return NextResponse.json({
      success: true,
      message: "Roster has been generated",
      data: roster,
    });
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

    let roster;
    if (id) {
      roster = await rosterService.getRosterById(id);
    } else if (month) {
      roster = await rosterService.getRosterByMonth(month);
    } else {
      const rosters = await rosterService.getAllRosters();
      return NextResponse.json({
        success: true,
        message: "Here are the rosters",
        data: rosters,
      });
    }

    if (roster) {
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

  try {
    if (rosterId) {
      await rosterService.deleteRoster(rosterId);
    } else if (month) {
      await rosterService.deleteRosterByMonth(month);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Either rosterId or month must be provided",
        },
        { status: 400 }
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { month, roster } = body;

    if (!month || !roster) {
      return NextResponse.json(
        {
          success: false,
          message: "Month and roster data are required",
        },
        { status: 400 }
      );
    }

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

    // Find roster by month first
    const existingRoster = await rosterService.getRosterByMonth(month);
    if (!existingRoster) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    const updatedRoster = await rosterService.updateRoster(
      existingRoster.id,
      roster
    );

    return NextResponse.json({
      success: true,
      message: "Roster has been updated",
      data: updatedRoster,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update roster.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
