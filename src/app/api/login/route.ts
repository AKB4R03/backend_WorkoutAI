import { compare } from "@/db/utils/bcrypt";
import { z } from "zod";
import { cookies } from "next/headers";
import { signToken } from "@/db/utils/jwt";
import { getUserByEmail } from "@/db/models/userInfo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().nonempty(),
    });

    const parsedData = loginSchema.safeParse({
      email: data.email,
      password: data.password,
    });

    if (!parsedData.success) {
      const errorPath = parsedData.error.issues[0].path[0];
      const errorMessage = parsedData.error.issues[0].message;
      const errorFinal = `${errorPath} - ${errorMessage}`;
      return NextResponse.json({
        statusCode: 400,
        message: errorFinal,
      });
    }

    const user = await getUserByEmail(parsedData.data.email);

    // Pastikan await digunakan di sini
    if (!user || !(await compare(parsedData.data.password, user.password))) {
      return NextResponse.json({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = signToken(payload);

    const cookieStore = cookies();
    (await cookieStore).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Tambahkan log untuk memastikan kuki diset
    console.log("Token set in cookies:", token);

    return NextResponse.json({
      statusCode: 200,
      message: "Success login",
    });
  } catch (error) {
    console.log(error, "==== err");
    return NextResponse.json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
}
