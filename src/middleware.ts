import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readPayload } from "./db/utils/jwt";

export const middleware = async (request: NextRequest) => {
  if (
    request.url.includes("/api") &&
    !request.url.includes("/api/login") && // Mengecualikan /api/login
    !request.url.includes("/api/userInfo") && // Mengecualikan /api/login
    !request.url.includes("_next/static") &&
    !request.url.includes("_next/image") &&
    !request.url.includes("favicon.ico")
  ) {
    console.log(request.method, request.url);

    const cookiesStore = await cookies();
    const token = cookiesStore.get("token");
    console.log(token, "===========");

    if (!token) {
      return NextResponse.json({
        statusCode: 401,
        error: "Unauthorized",
      });
    }

    const tokenData = await readPayload<{ id: string; email: string }>(
      token.value
    );

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", tokenData.id);
    requestHeaders.set("x-user-email", tokenData.email);

    return NextResponse.next({
      headers: requestHeaders,
    });
  }
  return NextResponse.next();
};
