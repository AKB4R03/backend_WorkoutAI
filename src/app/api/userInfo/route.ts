import { insertUserInfo } from "@/db/models/userInfo";
import { NextRequest, NextResponse } from "next/server";

type UserInfoModel = {
  username: string;
  email: string;
  height: number;
  weight: number;
};

type MyResponse = {
  statusCode: number;
  message?: string;
  data?: UserInfoModel;
  error?: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: UserInfoModel = await request.json();

    const user = await insertUserInfo(data);

    if (
      typeof data.username !== "string" ||
      typeof data.email !== "string" ||
      typeof data.height !== "number" ||
      typeof data.weight !== "number"
    ) {
      return NextResponse.json<MyResponse>(
        {
          statusCode: 400,
          message: "Invalid input data types",
          error: "Validation error",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json<MyResponse>({
      statusCode: 201,
      message: "succeed save user info",
    });
  } catch (error) {
    console.log(error, "=== error ===");
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Internal Server Error !",
      },
      {
        status: 500,
      }
    );
  }
}
