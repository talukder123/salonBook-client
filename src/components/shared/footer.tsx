
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-[#111827] via-[#08083D] to-[#000033] text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/salonBook.png"
                alt="SalonBook"
                width={180}
                height={55}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-300">
              Your beauty, our priority. Discover and book
              trusted salon services with ease. Experience
              professional care and a seamless booking journey
              with SalonBook.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-blue-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-300">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-blue-300">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-300">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Contact Us
            </h3>

            <ul className="space-y-5 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>your-email@example.com</span>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>+880 1XXXXXXXXX</span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>Your Salon Address, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="mb-6 text-base font-bold text-white">
              Opening Hours
            </h3>

            <ul className="space-y-5 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <div>
                  <p className="font-medium text-white">
                    Monday - Saturday
                  </p>
                  <p className="mt-1">10:00 AM - 09:00 PM</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <div>
                  <p className="font-medium text-white">Sunday</p>
                  <p className="mt-1">Closed</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Large Brand Name */}
        <div className="mt-20 border-t border-white/10 pt-8">
          <h2 className="w-full text-center text-[clamp(2.5rem,12vw,10rem)] font-black leading-tight tracking-tighter text-white">
            SalonBook
          </h2>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>

          <p className="text-sm text-gray-400">
            Your beauty, our priority.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;