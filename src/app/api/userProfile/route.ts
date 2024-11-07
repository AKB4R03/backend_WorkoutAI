import { getUserById } from "@/db/models/userInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId || userId.length !== 24) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid or missing user ID.",
        },
        { status: 400 }
      );
    }

    const data = await getUserById(userId);

    return NextResponse.json({
      statusCode: 200,
      data: data,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    // Response error
    return NextResponse.json(
      {
        statusCode: 500,
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
