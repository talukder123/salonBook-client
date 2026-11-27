
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
    ShieldAlert,
    Home,
    ArrowLeft,
    LayoutDashboard,
} from "lucide-react";

const ForbiddenPage = () => {
    const { data: session, isPending } = authClient.useSession();

    const role = (
        session?.user as {
            role?: string;
        } | undefined
    )?.role;

    const dashboardUrl =
        role === "admin"
            ? "/dashboard/admin"
            : "/dashboard/user";

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-xl text-center">

                {/* Error Icon */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border-2 border-red-100 bg-red-50">
                    <ShieldAlert className="h-12 w-12 text-red-500" />
                </div>

                {/* Error Code */}
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                    Access Denied
                </p>

                <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-[#0B1F54] sm:text-8xl">
                    403
                </h1>

                <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Forbidden Access
                </h2>

                <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
                    Sorry! You don&apos;t have permission to access this page.
                    Your account role does not allow you to view this resource.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center gap-3 sm:flex-row">

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-[#0B1F54] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#142f75]"
                    >
                        <Home size={18} />
                        Go to Home
                    </Link>

                    {isPending ? (
                        <div className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-400">
                            <LayoutDashboard size={18} />
                            Loading Dashboard...
                        </div>
                    ) : (
                        <Link
                            href={dashboardUrl}
                            className="inline-flex items-center justify-center gap-2 border border-[#0B1F54] px-6 py-3 text-sm font-semibold text-[#0B1F54] transition hover:bg-[#0B1F54] hover:text-white"
                        >
                            <LayoutDashboard size={18} />
                            Go to Dashboard
                        </Link>
                    )}
                </div>

                {/* Go Back */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0B1F54]"
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>

                <p className="mt-12 text-xs font-medium tracking-wide text-gray-400">
                    SALONBOOK · ACCESS CONTROL
                </p>

            </div>
        </main>
    );
};

export default ForbiddenPage;
