import { NextRequest, NextResponse } from "next/server";

const USERNAME = process.env.UNSCHOOL_USER ?? "wiktor";
const PASSWORD = process.env.UNSCHOOL_PASSWORD ?? "Jebacboston123!";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    return user === USERNAME && pass === PASSWORD;
  } catch {
    return false;
  }
}

function unauthorizedResponse(realm: string): NextResponse {
  return new NextResponse("Wymagane logowanie.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/unschool") || pathname.startsWith("/kurs");
}

function realmForPath(pathname: string): string {
  if (pathname.startsWith("/kurs")) return "Kurs";
  return "Unschool Your English";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nigdy nie dotykaj assetów Next.js (chunki, HMR, obrazy) — inaczej ChunkLoadError w dev
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return unauthorizedResponse(realmForPath(pathname));
}

export const config = {
  matcher: ["/unschool", "/unschool/:path*", "/kurs", "/kurs/:path*"],
};
