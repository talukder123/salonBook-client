
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import signinImage from "../../../../public/images/AUTH/sign-in-page.jpg";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return "";

    const params = new URLSearchParams(window.location.search);

    return params.get("error") === "blocked"
      ? "Your account has been blocked. Please contact support."
      : "";
  });

  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Validate callback URL
  const getSafeCallbackUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get("callbackUrl");

    if (!callbackUrl) return null;

    try {
      // Prevent external redirects
      if (
        !callbackUrl.startsWith("/") ||
        callbackUrl.startsWith("//") ||
        callbackUrl.includes("\\")
      ) {
        return null;
      }

      const url = new URL(callbackUrl, window.location.origin);

      if (url.origin !== window.location.origin) {
        return null;
      }

      // Prevent redirect loops
      const blockedPaths = [
        "/sign-in",
        "/signin",
        "/sign-up",
        "/forbidden",
      ];

      if (
        blockedPaths.some(
          (path) =>
            url.pathname === path ||
            url.pathname.startsWith(`${path}/`)
        )
      ) {
        return null;
      }

      return url.pathname + url.search + url.hash;
    } catch {
      return null;
    }
  };

  // Email and Password Login
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
        return;
      }

      setSuccess("You have signed in successfully!");

      // Redirect directly to the requested page.
      // Proxy will verify the session and user role.
      const callbackUrl = getSafeCallbackUrl();

      window.location.replace(callbackUrl || "/sign-in");
    } catch (err) {
      console.error("Sign In Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setIsGoogleLoading(true);

      const callbackUrl = getSafeCallbackUrl();

      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/sign-in",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google sign in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Sign In Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#0B1F54] uppercase tracking-widest mb-3">
              Welcome Back
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Sign In to SalonBook
            </h1>

            <p className="text-gray-500 text-sm leading-6">
              Sign in to manage your appointments and enjoy a seamless salon
              booking experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                  autoComplete="email"
                  className="w-full h-12 border border-gray-300 pl-11 pr-4 text-sm outline-none focus:border-[#0B1F54] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#0B1F54] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                  autoComplete="current-password"
                  className="w-full h-12 border border-gray-300 pl-11 pr-12 text-sm outline-none focus:border-[#0B1F54] transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F54]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="bg-green-50 border border-green-200 text-green-700 text-sm p-3">
                {success}
              </p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-12 bg-[#0B1F54] hover:bg-[#08183F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400 font-medium">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 border border-gray-300 hover:border-[#0B1F54] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 transition"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.63 5.91c4.45-4.1 7.13-10.14 7.13-17.56Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.63-5.91c-2.12 1.42-4.83 2.26-8.27 2.26-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {isGoogleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-7">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#0B1F54] hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:block relative h-[650px] w-full overflow-hidden">
          <Image
            src={signinImage}
            alt="SalonBook sign in"
            fill
            priority
            sizes="(max-width: 1024px) 0px, 50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#071633]/90 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4">
              Your Beauty, Your Schedule
            </p>

            <h2 className="text-3xl font-bold leading-snug mb-4">
              Your Favorite Salon, Just a Few Clicks Away.
            </h2>

            <p className="text-sm text-gray-200 leading-7 max-w-md">
              Discover trusted salons, book your favorite services, and
              manage all your appointments in one convenient place.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SignInPage;