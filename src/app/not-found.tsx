
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Home,
  LayoutDashboard,
  ArrowLeft,
  Scissors,
  SearchX,
  LogIn,
} from "lucide-react";

const NotFound = () => {
  const { data: session, isPending } = authClient.useSession();

  const role = (
    session?.user as { role?: string } | undefined
  )?.role;

  const isLoggedIn = !!session?.user;

  const dashboardUrl =
    role === "admin"
      ? "/dashboard/admin"
      : role === "user"
        ? "/dashboard/user"
        : null;

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-blue-100 bg-blue-50 text-[#0B1F54]">
          <SearchX size={38} strokeWidth={1.6} />
        </div>

        {/* 404 */}
        <p className="text-8xl font-extrabold tracking-tight text-[#0B1F54] sm:text-9xl">
          404
        </p>

        <div className="mx-auto mt-5 h-1 w-20 bg-orange-500" />

        {/* Message */}
        <h1 className="mt-7 text-2xl font-bold text-gray-900 sm:text-3xl">
          Oops! Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
          The page you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#0B1F54] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#162F70]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          {!isPending && (
            <>
              {dashboardUrl && (
                <Link
                  href={dashboardUrl}
                  className="inline-flex items-center justify-center gap-2 border border-[#0B1F54] bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F54] transition-colors hover:bg-blue-50"
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                </Link>
              )}

              {!isLoggedIn && (
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 border border-[#0B1F54] bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F54] transition-colors hover:bg-blue-50"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              )}
            </>
          )}

        </div>

        {/* Branding */}
        <div className="mt-14 flex items-center justify-center gap-2 text-sm font-semibold text-gray-400">
          <Scissors size={17} />
          SalonBook
        </div>

      </div>
    </main>
  );
};

export default NotFound;
