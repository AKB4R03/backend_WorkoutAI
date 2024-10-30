import { insertUserInfo } from "@/db/models/userInfo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type UserInfoModel = {
  username: string;
  email: string;
  password: string;
  height: number;
  weight: number;
};

const userInputSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  height: z.number(),
  weight: z.number(),
});

type MyResponse = {
  statusCode: number;
  message?: string;
  data?: UserInfoModel;
  error?: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: UserInfoModel = await request.json();

    const parsedData = userInputSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    await insertUserInfo(data);

    return NextResponse.json<MyResponse>({
      statusCode: 201,
      message: "succeed save user info",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      const errorPath = error.issues[0].path[0];
      const errorMessage = error.issues[0].message;

      return NextResponse.json<MyResponse>(
        {
          statusCode: 400,
          error: `${errorPath} - ${errorMessage}`,
        },
        {
          status: 400,
        }
      );
    }

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
