import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Roster from "@/models/roster";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const { userId } = params;

    if (!month) {
      return NextResponse.json(
        { success: false, message: "Month is required in query" },
        { status: 400 }
      );
    }

    const roster = await Roster.findOne({ month: month.replaceAll("-", " ") });
    if (!roster) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    const userSubmission = roster.submissions.find(
      (sub) => sub.userId === userId
    );
    if (!userSubmission) {
      return NextResponse.json(
        { success: false, message: "No submission found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submitted dates fetched successfully",
      data: userSubmission.submittedDates,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month")?.replace(/-/g, " ");
    const { userId } = params;
    const body = await req.json();

    if (!month) {
      return NextResponse.json(
        { success: false, message: "Month is required in query" },
        { status: 400 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Dates are required in body" },
        { status: 400 }
      );
    }

    const roster = await Roster.findOne({ month });

    if (!roster || (Array.isArray(roster) && roster.length === 0)) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    const index = roster.submissions.findIndex((sub) => sub.userId === userId);

    if (index === -1) {
      roster.submissions.push({ userId, submittedDates: body.dates });
    } else {
      roster.submissions[index].submittedDates = body.dates;
    }

    await roster.save();

    return NextResponse.json({
      success: true,
      message: "Availability has been submitted",
      data: roster.submissions[
        index !== -1 ? index : roster.submissions.length - 1
      ],
    });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
