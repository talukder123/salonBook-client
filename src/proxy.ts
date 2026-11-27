
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type UserRole = "admin" | "user";

// Authentication routes
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

// Protected routes
const ADMIN_ROUTE = "/dashboard/admin";
const CUSTOMER_ROUTE = "/dashboard/user";
const DASHBOARD_ROUTE = "/dashboard";
const SERVICE_DETAILS_ROUTE = "/services";

// Check exact route or nested route
const isRoute = (pathname: string, route: string) => {
  return pathname === route || pathname.startsWith(`${route}/`);
};

// Default dashboard based on role
const getDashboardUrl = (role: UserRole) => {
  return role === "admin"
    ? "/dashboard/admin/dashboard"
    : "/dashboard";
};

// Role-based route authorization
const hasRouteAccess = (pathname: string, role: UserRole) => {
  // Admin dashboard: Admin only
  if (isRoute(pathname, ADMIN_ROUTE)) {
    return role === "admin";
  }

  // Customer dashboard: User only
  if (isRoute(pathname, CUSTOMER_ROUTE)) {
    return role === "user";
  }

  // General dashboard: Customer only
  if (isRoute(pathname, DASHBOARD_ROUTE)) {
    return role === "user";
  }

  return true;
};

// Validate callback URL
const getSafeCallbackUrl = (
  callbackUrl: string | null,
  requestUrl: string,
  role: UserRole
) => {
  if (!callbackUrl) return null;

  try {
    const url = new URL(callbackUrl, requestUrl);

    // Prevent external redirects
    if (
      url.origin !== new URL(requestUrl).origin ||
      !callbackUrl.startsWith("/") ||
      callbackUrl.startsWith("//") ||
      callbackUrl.includes("\\")
    ) {
      return null;
    }

    // Prevent redirect loops
    if (
      isRoute(url.pathname, "/sign-in") ||
      isRoute(url.pathname, "/sign-up") ||
      isRoute(url.pathname, "/forbidden")
    ) {
      return null;
    }

    // Prevent redirecting to unauthorized routes
    if (!hasRouteAccess(url.pathname, role)) {
      return null;
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Dashboard routes are protected
  const isDashboardRoute = isRoute(pathname, DASHBOARD_ROUTE);

  // Only /services/[id] is protected.
  // /services remains public.
  const isServiceDetailsRoute =
    isRoute(pathname, SERVICE_DETAILS_ROUTE) &&
    pathname.split("/").filter(Boolean).length === 2;

  const isPrivateRoute =
    isDashboardRoute || isServiceDetailsRoute;

  // Continue for unrelated public routes
  if (!isAuthRoute && !isPrivateRoute) {
    return NextResponse.next();
  }

  // Get Better Auth session
  let session;

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Authentication check failed:", error);

    if (isPrivateRoute) {
      const signInUrl = new URL("/sign-in", request.url);

      signInUrl.searchParams.set(
        "callbackUrl",
        pathname + request.nextUrl.search
      );

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // Unauthenticated user
  if (!session?.user) {
    if (isPrivateRoute) {
      const signInUrl = new URL("/sign-in", request.url);

      signInUrl.searchParams.set(
        "callbackUrl",
        pathname + request.nextUrl.search
      );

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // Get authenticated user information
  const user = session.user as typeof session.user & {
    role?: string;
    isBlocked?: boolean;
  };

  const role = user.role;

  // Validate user role
  if (!role || !["admin", "user"].includes(role)) {
    if (isPrivateRoute) {
      return NextResponse.redirect(
        new URL("/forbidden", request.url)
      );
    }

    return NextResponse.next();
  }

  const userRole = role as UserRole;

  // Blocked users cannot access private routes
  if (user.isBlocked === true && isPrivateRoute) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set("error", "blocked");

    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from signin/signup
  if (isAuthRoute) {
    if (user.isBlocked === true) {
      return NextResponse.next();
    }

    const callbackUrl = getSafeCallbackUrl(
      request.nextUrl.searchParams.get("callbackUrl"),
      request.url,
      userRole
    );

    const redirectUrl =
      callbackUrl || getDashboardUrl(userRole);

    return NextResponse.redirect(
      new URL(redirectUrl, request.url)
    );
  }

  // Role-based route protection
  if (!hasRouteAccess(pathname, userRole)) {
    return NextResponse.redirect(
      new URL("/forbidden", request.url)
    );
  }

  return NextResponse.next();
}

// Proxy matcher
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/services/:path*",
    "/sign-in",
    "/sign-up",
  ],
};