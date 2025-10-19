import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@shared/auth/jwt";

const protectedRoutes = ["/playground", "/dashboard", "/admin", "/resources", "/difficulty"];
const publicRoutes = ["/", "/api/auth"];

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	const authToken = request.cookies.get("auth_token")?.value;

	const { valid } = await verifyAuthToken(authToken!);

	if (valid && pathname === "/") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	} 

	const isPublicRoute = publicRoutes.some((route) => pathname === route);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	if (!isProtectedRoute && pathname !== "/login") {
		return NextResponse.next();
	}

	if (!authToken && !pathname.startsWith("/login")) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	} else if (!authToken && pathname.startsWith("/login")) {
		return NextResponse.next();
	}

	if (!valid && pathname.startsWith("/login")) {
		return NextResponse.next();
	} else if (!valid) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	const redirect = searchParams.get("redirect");

	if (!pathname.startsWith("/login")) {
		return NextResponse.next();
	}
	const redirectUrl = new URL(redirect || "/", request.url);
	return NextResponse.redirect(redirectUrl);
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
