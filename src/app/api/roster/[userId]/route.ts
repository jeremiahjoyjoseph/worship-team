import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const { userId } = context.params;

    if (!month) {
      return NextResponse.json(
        { success: false, message: "Month is required in query" },
        { status: 400 }
      );
    }

    // Get roster by month
    const { data: roster, error: rosterError } = await supabase
      .from("rosters")
      .select("id")
      .eq("month", month.replaceAll("-", " "))
      .single();

    if (rosterError || !roster) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    // Get user submission
    const { data: submission, error: submissionError } = await supabase
      .from("roster_submissions")
      .select("submitted_dates")
      .eq("roster_id", roster.id)
      .eq("user_id", userId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { success: false, message: "No submission found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submitted dates fetched successfully",
      data: submission.submitted_dates,
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
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month")?.replace(/-/g, " ");
    const { userId } = context.params;
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

    // Get roster by month
    const { data: roster, error: rosterError } = await supabase
      .from("rosters")
      .select("id")
      .eq("month", month)
      .single();

    if (rosterError || !roster) {
      return NextResponse.json(
        { success: false, message: "Roster not found" },
        { status: 404 }
      );
    }

    // Upsert submission
    const { data: submission, error: submissionError } = await supabase
      .from("roster_submissions")
      .upsert({
        roster_id: roster.id,
        user_id: userId,
        submitted_dates: body.dates,
      })
      .select()
      .single();

    if (submissionError) {
      throw submissionError;
    }

    return NextResponse.json({
      success: true,
      message: "Availability has been submitted",
      data: submission,
    });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
