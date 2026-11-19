
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    ImagePlus,
} from "lucide-react";
import Image from "next/image";
import signupImage from "../../../../public/images/AUTH/sign-up-page.jpg";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Password validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!profileImage && !imageUrl.trim()) {
            setError("Please upload a profile image or provide an image URL.");
            return;
        }

        // Form data for testing
        console.log("Sign Up Form Data:", {
            fullName,
            email,
            // Passwords intentionally excluded from console logging
            profileImage: profileImage || imageUrl,
        });

        alert("Form submitted successfully! Check your console.");
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
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B1F54]"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        className="w-full border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B1F54]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
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
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
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
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Profile Image
                                </label>

                                <div className="relative">
                                    <ImagePlus
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
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
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#0B1F54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08183F]"
                            >
                                Create Account
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
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-3 border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 opacity-70"
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
                            Sign Up with Google
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
