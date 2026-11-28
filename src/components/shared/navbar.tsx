"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";

// Types
type ProfileDropdownProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

// Profile Dropdown
const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = user.role === "admin";

  const dashboardHref = isAdmin
    ? "/dashboard/admin"
    : "/dashboard/user";

  const profileHref = isAdmin
    ? "/dashboard/admin/myprofile"
    : "/dashboard/user/my-profile";

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setProfileOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Popover open={profileOpen} onOpenChange={setProfileOpen}>
      {/* Profile Trigger */}
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full border border-gray-300/70 bg-white/70 px-2 py-1.5 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-[#0B1F54] hover:shadow-[0_0_0_2px_rgba(11,31,84,0.08)] dark:border-zinc-600/70 dark:bg-zinc-900/70 dark:hover:border-blue-400"
          >
            <Avatar className="h-9 w-9 rounded-full border-0 ring-0">
              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User"}
                className="object-cover"
              />

              <AvatarFallback className="rounded-full bg-[#0B1F54] text-sm font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <ChevronDown
              size={17}
              strokeWidth={2}
              className={`text-gray-500 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        }
      >
        Open Profile
      </PopoverTrigger>

      {/* Profile Dropdown Content */}
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[290px] overflow-hidden rounded-none border border-gray-200 bg-white p-2.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="space-y-2">
          {/* User Information */}
          <PopoverHeader className="flex flex-row items-center gap-3 bg-gray-50 px-3 py-3 dark:bg-zinc-800">
            <Avatar className="h-11 w-11 shrink-0 rounded-full border-0 ring-0">
              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User"}
                className="object-cover"
              />

              <AvatarFallback className="rounded-full bg-[#0B1F54] text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <PopoverTitle className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user.name || "User"}
              </PopoverTitle>

              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </PopoverHeader>

          {/* Navigation Items */}
          <div className="space-y-1">
            {/* Dashboard */}
            <Link
              href={dashboardHref}
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#0B1F54] dark:text-gray-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <LayoutDashboard size={18} strokeWidth={1.8} />
              <span>Dashboard</span>
            </Link>

            {/* Manage Profile */}
            <Link
              href={profileHref}
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#0B1F54] dark:text-gray-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <UserRound size={18} strokeWidth={1.8} />
              <span>Manage Profile</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-1">
            <Separator className="mb-2 bg-gray-200 dark:bg-zinc-700" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 bg-red-50 px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <LogOut size={18} strokeWidth={1.8} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Main Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/salonBook.png"
              alt="SalonBook Logo"
              width={48}
              height={48}
              priority
              className="h-11 w-11 object-contain"
            />

            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Salon<span className="text-[#0B1F54]">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-600 transition-colors hover:text-[#0B1F54] dark:text-gray-300 dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Desktop Authentication */}
            <div className="hidden items-center gap-3 md:flex">
              {isPending ? (
                <div className="h-10 w-10 animate-pulse bg-gray-200 dark:bg-zinc-800" />
              ) : user ? (
                <ProfileDropdown user={user} />
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="border border-[#0B1F54] px-5 py-2.5 text-sm font-semibold text-[#0B1F54] transition-colors hover:bg-[#0B1F54] hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className="bg-[#0B1F54] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#08183F]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Profile */}
            <div className="md:hidden">
              {!isPending && user && (
                <ProfileDropdown user={user} />
              )}

              {isPending && (
                <div className="h-10 w-10 animate-pulse bg-gray-200 dark:bg-zinc-800" />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="border border-gray-300 p-2 text-gray-700 transition-colors hover:text-[#0B1F54] dark:border-zinc-700 dark:text-gray-200 md:hidden"
            >
              {isOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-gray-200 bg-white/90 px-6 py-5 backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/90 md:hidden">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-[#0B1F54] dark:text-gray-200"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Authentication */}
              {!isPending && !user && (
                <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-zinc-800">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="border border-[#0B1F54] px-5 py-2.5 text-center text-sm font-semibold text-[#0B1F54] transition-colors hover:bg-[#0B1F54] hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#0B1F54] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#08183F]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;