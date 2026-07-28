import {
    NextRequest,
    NextResponse,
} from "next/server";

export function middleware(
    request: NextRequest
) {
    const pathname =
        request.nextUrl.pathname;

    if (pathname !== "/login") {
        return NextResponse.next();
    }

    const access =
        request.cookies.get(
            "terminal-access"
        );

    if (!access) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login"],
};