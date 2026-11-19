
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/salonBook.png"
            alt="SalonBook"
            width={180}
            height={55}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0B1F54]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="border border-gray-300 p-2 text-gray-700 transition-colors hover:text-[#0B1F54] md:hidden"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-[#0B1F54]"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5">
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
