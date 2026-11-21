
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
    LayoutDashboard,
    Scissors,
    PlusCircle,
    CalendarDays,
    Users,
    CreditCard,
    UserRound,
    LogOut,
} from "lucide-react";

import type { Tuser } from "../../../type";
import { authClient } from "@/lib/auth-client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Admin Navigation
const adminNavItems = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Services",
    href: "/dashboard/admin/services",
    icon: Scissors,
  },
  {
    title: "Manage Appointments",
    href: "/dashboard/admin/appointments",
    icon: CalendarDays,
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/manage-users",
    icon: Users,
  },
  {
    title: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "My Profile",
    href: "/dashboard/admin/myprofile",
    icon: UserRound,
  },
];

// Customer Navigation
const customerNavItems = [
    {
        title: "Overview",
        href: "/dashboard/user",
        icon: LayoutDashboard,
    },
    {
        title: "My Appointments",
        href: "/dashboard/user/my-appointment",
        icon: CalendarDays,
    },
    {
        title: "My Profile",
        href: "/dashboard/user/my-profile",
        icon: UserRound,
    },
];

const DashboardSidebar = ({ user }: { user: Tuser }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isAdmin = user.role === "admin";

    const navItems = isAdmin ? adminNavItems : customerNavItems;

    // Logout
    const handleLogout = async () => {
        try {
            await authClient.signOut();

            router.replace("/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-[#E2E8F0]"
        >
            {/* Logo */}
            <SidebarHeader className="h-[84px] shrink-0 justify-center overflow-hidden border-b border-[#E2E8F0] bg-[#F6F8FC] px-4 py-3 group-data-[collapsible=icon]:px-0">
                <Link
                    href="/"
                    className="flex h-12 w-full min-w-0 items-center justify-start gap-3 overflow-hidden transition-colors hover:bg-white/80 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:justify-center"
                >
                    <span className="flex size-11 shrink-0 items-center justify-center bg-white shadow-sm ring-1 ring-[#E2E8F0]">
                        <Image
                            src="/images/salonBook.png"
                            alt="SalonBook"
                            width={36}
                            height={36}
                            priority
                            className="size-9 object-contain"
                        />
                    </span>

                    <span className="grid min-w-0 gap-0.5 group-data-[collapsible=icon]:hidden">
                        <span className="truncate whitespace-nowrap text-[19px] font-bold tracking-tight text-[#14254B]">
                            SalonBook
                        </span>

                        <span className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A8557]">
                            Beauty, booked beautifully
                        </span>
                    </span>
                </Link>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="overflow-x-hidden bg-[#F6F8FC] px-3 py-6 group-data-[collapsible=icon]:px-0">
                <SidebarGroup className="min-w-0 p-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-0">
                    <SidebarGroupLabel className="mb-3 h-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A19A8D] group-data-[collapsible=icon]:hidden">
                        {isAdmin ? "Admin Workspace" : "Customer Workspace"}
                    </SidebarGroupLabel>

                    <SidebarMenu className="w-full gap-1.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            const active =
                                pathname === item.href ||
                                (item.title !== "Overview" &&
                                    pathname.startsWith(`${item.href}/`));

                            return (
                                <SidebarMenuItem
                                    key={item.href}
                                    className="w-full min-w-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                                >
                                    <SidebarMenuButton
                                        render={<Link href={item.href} />}
                                        isActive={active}
                                        tooltip={item.title}
                                        className={`h-12 w-full min-w-0 rounded-xl px-3 text-[13px] font-medium transition-all duration-200 group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!h-11 group-data-[collapsible=icon]:!w-11 group-data-[collapsible=icon]:!min-w-11 group-data-[collapsible=icon]:!max-w-11 group-data-[collapsible=icon]:!shrink-0 group-data-[collapsible=icon]:!grow-0 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:[&>span]:!hidden ${active
                                                ? "bg-[#E8EEF9] text-[#14254B] data-active:bg-[#E8EEF9] data-active:text-[#14254B] shadow-sm hover:bg-[#DCE7F8] hover:text-[#14254B]"
                                                : "text-[#626A78] hover:bg-white hover:text-[#14254B] hover:shadow-sm"
                                            }`}
                                    >
                                        <Icon
                                            className={`!size-5 shrink-0 ${active ? "text-[#0B1F54]" : "text-[#8B93A1]"
                                                }`}
                                        />

                                        <span className="min-w-0 truncate">
                                            {item.title}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="shrink-0 gap-3 border-t border-[#E2E8F0] bg-[#F6F8FC] p-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
                {/* User Information */}
                <div className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-2.5 shadow-[0_2px_8px_-6px_rgba(20,37,75,0.3)] group-data-[collapsible=icon]:!w-11 group-data-[collapsible=icon]:!h-11 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!border-transparent group-data-[collapsible=icon]:!bg-transparent group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!shadow-none">
                    {/* Profile Image */}
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                            src={user.image || "/images/default-avatar.png"}
                            alt={user.name || "User"}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                        />
                    </div>

                    {/* User Details */}
                    <div className="grid min-w-0 flex-1 gap-1 group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-[12px] font-semibold text-[#26334D]">
                            {user.name}
                        </span>

                        <span className="w-fit rounded-full bg-[#EEF3FA] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#5F7292]">
                            {user.role === "user" ? "Customer" : "Admin"}
                        </span>
                    </div>
                </div>

                {/* Logout */}
                <SidebarMenu className="w-full gap-0 group-data-[collapsible=icon]:items-center">
                    <SidebarMenuItem className="w-full min-w-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                        <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip="Logout"
                            className="h-11 w-full min-w-0 rounded-xl px-3 text-[13px] font-semibold text-[#8B6570] transition-all hover:bg-[#F9EFF0] hover:text-[#A3404B] group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!h-11 group-data-[collapsible=icon]:!w-11 group-data-[collapsible=icon]:!min-w-11 group-data-[collapsible=icon]:!max-w-11 group-data-[collapsible=icon]:!shrink-0 group-data-[collapsible=icon]:!grow-0 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:[&>span]:!hidden"
                        >
                            <LogOut className="!size-5 shrink-0" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSidebar;
