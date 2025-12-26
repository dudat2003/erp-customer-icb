import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname === "/login" || pathname === "/register") &&
    request.cookies.has("userAuth")
  )
    return NextResponse.redirect(new URL("/", request.url));

  if (
    (pathname === "/" || pathname === "/customers" || pathname === "/staff") &&
    !request.cookies.has("userAuth")
  )
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/customers", "/staff", "/login", "/register"],
};
