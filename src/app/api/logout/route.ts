import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return NextResponse.json({
      statusCode: 200,
      message: "Logout successful, token deleted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      statusCode: 500,
      message: error,
    });
  }
}
