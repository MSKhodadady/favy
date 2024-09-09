import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/sign-")) {
    const authCookie = request.cookies.get(AUTH_COOKIE_KEY)?.value;
    const username = request.cookies.get(USERNAME_COOKIE_KEY)?.value;
    if (authCookie != undefined) {
      return NextResponse.redirect(new URL(`/u/${username}`, request.url));
    }
  }
}
