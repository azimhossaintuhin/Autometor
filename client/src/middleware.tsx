import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {

    const authCookie = request.cookies.get('access')?.value;
    
    
    if (!authCookie) {
        const loginUrl = new URL('/login', request.url);
       
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile',
        '/repo/:path*',
        // Add any other protected routes here
    ]
}