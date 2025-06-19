import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWTPayload } from "./utils/jwt";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    const tokenPayload = decodeJWTPayload(token);
    const tokenExp = tokenPayload?.exp;

    if (pathname.startsWith('/dashboard')) {
        if (!token || !tokenPayload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Optional: cek expired
        if (tokenExp && Date.now() >= tokenExp * 1000) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (pathname === '/login') {
        if (token && tokenPayload) {
            // Jika token masih valid, redirect ke dashboard
            if (!tokenExp || Date.now() < tokenExp * 1000) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/dashboard/:path*', '/login'],
};
