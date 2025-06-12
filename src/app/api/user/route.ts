import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { CreateUserInput } from "@/types/user";

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

    await connectToDatabase();

    const processedUsers = await Promise.all(
      users.map(async (userData: CreateUserInput) => {
        const existingUser = await User.findOne({
          $or: [{ email: userData.email }, { username: userData.username }],
        });

        if (existingUser) {
          throw new Error(
            `User with email ${userData.email} or username ${userData.username} already exists`
          );
        }

        const fullName =
          userData.fullName ||
          `${userData.firstName}${
            userData.middleName ? ` ${userData.middleName}` : ""
          }${userData.lastName ? ` ${userData.lastName}` : ""}`;

        return {
          ...userData,
          fullName,
          createdAt: new Date(),
          status: userData.status || "active",
        };
      })
    );

    const createdUsers = await User.insertMany(processedUsers);
    const usersWithoutPassword = createdUsers.map((user) => user.toObject());

    return NextResponse.json(
      {
        success: true,
        message: `Successfully created ${usersWithoutPassword.length} user(s)`,
        data: usersWithoutPassword,
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

    await connectToDatabase();

    // Delete users by IDs
    const result = await User.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "No users deleted. IDs may not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Deleted ${result.deletedCount} user(s)`,
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
