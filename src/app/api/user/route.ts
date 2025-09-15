import { NextResponse } from "next/server";
import { userService } from "@/lib/supabase-db";

export async function GET() {
  try {
    const users = await userService.getAllUsers();
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, error: "No users provided" },
        { status: 400 }
      );
    }

    // Check for existing users
    for (const userData of users) {
      const exists = await userService.checkUserExists(
        userData.email,
        userData.username
      );
      if (exists) {
        return NextResponse.json(
          {
            success: false,
            error: `User with email ${userData.email} or username ${userData.username} already exists`,
          },
          { status: 400 }
        );
      }
    }

    const createdUsers = await userService.createUsers(users);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully created ${createdUsers.length} user(s)`,
        data: createdUsers,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No user IDs provided" },
        { status: 400 }
      );
    }

    await userService.deleteUsers(ids);

    return NextResponse.json(
      {
        success: true,
        message: `Deleted ${ids.length} user(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
