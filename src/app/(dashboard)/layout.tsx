
import React from "react";

import DashboardSidebar from "@/components/dashboard/dashboardSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const isAdmin = session.user.role === "admin";

  return (
    <SidebarProvider>
      <DashboardSidebar user={session.user} />

      <SidebarInset className="min-w-0 bg-gray-50">
        <header className="relative z-10 flex h-14 w-full shrink-0 items-center gap-3 border-b bg-white px-4">
    <SidebarTrigger className="size-9 shrink-0" />

    <div className="h-5 w-px shrink-0 bg-gray-200" />

    <h1 className="truncate font-semibold text-[#0B1F54]">
        {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
    </h1>
</header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
