import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();
    return NextResponse.json(
      { success: true, message: "We have a team!", data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
