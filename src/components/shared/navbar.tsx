
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

  const dashboardHref =
  user.role === "admin"
    ? "/dashboard/admin"
    : "/dashboard/user";

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
      {/* Avatar Trigger */}
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className="flex items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80"
          >
            <Avatar className="h-10 w-10 rounded-full border-0 ring-0">
              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User"}
                className="object-cover"
              />

              <AvatarFallback className="rounded-full bg-[#0B1F54] text-sm font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      >
        Open Profile
      </PopoverTrigger>

      {/* Profile Dropdown */}
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[290px] overflow-hidden rounded-[24px] border border-white/80 bg-white/75 p-2.5 shadow-[0_12px_45px_rgba(15,23,42,0.16)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-zinc-900/75 dark:shadow-black/30"
      >
        <div className="space-y-2">
          {/* User Information */}
          <PopoverHeader className="flex flex-row items-center gap-3 rounded-2xl bg-white/55 px-3 py-3 dark:bg-white/[0.06]">
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
          <div className="space-y-1 rounded-2xl bg-white/45 p-1.5 dark:bg-white/[0.04]">
            <Link
              href={dashboardHref}
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white/90 hover:text-[#0B1F54] hover:shadow-sm dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <LayoutDashboard size={18} strokeWidth={1.8} />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/manage-profile"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white/90 hover:text-[#0B1F54] hover:shadow-sm dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <UserRound size={18} strokeWidth={1.8} />
              <span>Manage Profile</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-1">
            <Separator className="mb-2 bg-gray-200/70 dark:bg-white/10" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-red-50/80 px-3 py-3 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
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