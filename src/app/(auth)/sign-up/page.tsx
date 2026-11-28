
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ImagePlus,
} from "lucide-react";

import signupImage from "../../../../public/images/AUTH/sign-up-page.jpg";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get a safe callback URL
  const getSafeCallbackUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get("callbackUrl");

    if (!callbackUrl) return null;

    if (
      !callbackUrl.startsWith("/") ||
      callbackUrl.startsWith("//") ||
      callbackUrl.includes("\\")
    ) {
      return null;
    }

    const pathname = callbackUrl.split("?")[0].split("#")[0];

    const blockedRoutes = [
      "/",
      "/sign-in",
      "/signin",
      "/sign-up",
      "/signup",
      "/forbidden",
    ];

    if (
      blockedRoutes.some(
        (route) =>
          pathname === route ||
          (route !== "/" && pathname.startsWith(`${route}/`))
      )
    ) {
      return null;
    }

    return callbackUrl;
  };

  // Upload profile image to ImgBB
  const uploadProfileImage = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMG_BB_API;

    if (!apiKey) {
      throw new Error("ImgBB API key is not configured.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      throw new Error("Profile image upload failed.");
    }

    return result.data.url as string;
  };

  // Email Sign Up
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (profileImage && !profileImage.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    try {
      setIsLoading(true);

      let uploadedImageUrl = imageUrl.trim();

      if (profileImage) {
        const toastId = toast.loading("Uploading profile image...");

        try {
          uploadedImageUrl = await uploadProfileImage(profileImage);
          toast.success("Profile image uploaded successfully.", {
            id: toastId,
          });
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Profile image upload failed.",
            { id: toastId }
          );
          return;
        }
      }

      const { error: signupError } = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        image: uploadedImageUrl || undefined,
      });

      if (signupError) {
        toast.error(
          signupError.message || "Unable to create your account."
        );
        return;
      }

      toast.success("Your account has been created successfully!");

      const callbackUrl = getSafeCallbackUrl();

      // Normal signup → Home
      // Private route signup → Requested route
      window.location.replace(callbackUrl || "/");
    } catch (err) {
      console.error("Sign Up Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);

      const callbackUrl = getSafeCallbackUrl();

      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });

      if (error) {
        toast.error(error.message || "Google sign up failed.");
        setIsGoogleLoading(false);
        return;
      }

      if (data?.url) {
        toast.loading("Redirecting to Google...");
        window.location.assign(data.url);
        return;
      }

      // Better Auth may handle the redirect automatically.
      toast.loading("Connecting to Google...");
    } catch (err) {
      console.error("Google Sign Up Error:", err);

      toast.error("Google sign up failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">

        {/* Left Side - Sign Up Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-3xl font-bold text-[#0B1F54]">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Join SalonBook and book your favorite salon services.
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B1F54]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your email"
                    required
                    className="w-full border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B1F54]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Create a password"
                    required
                    className="w-full border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#0B1F54]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Minimum 6 characters, including uppercase and lowercase letters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm your password"
                    required
                    className="w-full border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#0B1F54]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label
                  htmlFor="profileImage"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Profile Image (Optional)
                </label>

                <div className="relative">
                  <ImagePlus
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setProfileImage(e.target.files?.[0] || null);
                      setImageUrl("");
                    }}
                    className="w-full border border-gray-300 py-2.5 pl-10 pr-2 text-sm text-gray-500 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#0B1F54]"
                  />
                </div>

                {profileImage && (
                  <p className="mt-2 text-xs text-green-700">
                    Selected: {profileImage.name}
                  </p>
                )}

                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setProfileImage(null);
                  }}
                  placeholder="Paste your image URL"
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B1F54]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Your profile image will be uploaded to ImgBB.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#0B1F54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08183F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-[#0B1F54] hover:text-[#0B1F54] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.2 13.22l7.98 6.19C13.05 13.72 18.03 9.5 24 9.5Z"
                />
                <path
                  fill="#34A853"
                  d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.47-4.13 7.12-10.2 7.12-17.58Z"
                />
                <path
                  fill="#4285F4"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.87l-7.65-5.93c-2.13 1.43-4.84 2.28-8.26 2.28-6.34 0-11.71-4.28-13.62-10.03l-8.04 6.2C5.63 42.65 14.09 48 24 48Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.38 28.45A14.5 14.5 0 0 1 9.5 24c0-1.55.27-3.05.76-4.45l-7.98-6.2A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.54 10.65l7.84-6.2Z"
                />
              </svg>

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Sign Up with Google"}
            </button>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#0B1F54] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative hidden min-h-full lg:block">
          <Image
            src={signupImage}
            alt="Join SalonBook"
            width={600}
            height={900}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;