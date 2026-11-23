
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Pencil,
    UserRound,
    Mail,
    ShieldCheck,
    Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import EditProfileModal from "@/components/dashboard/user/EditProfileModal";

export interface IProfile {
    name: string;
    email: string;
    image?: string;
    role: string;
    createdAt?: string;
}

const MyProfileCustomer = () => {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch Profile
    const fetchProfile = useCallback(async () => {
        const data = await authClient.token();
        const token = data.data?.token;

        if (!token) {
            throw new Error("Authentication required.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch profile.");
        }

        return result.user as IProfile;
    }, []);

    // Initial Profile Load
    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                const user = await fetchProfile();

                if (!ignore) {
                    setProfile(user);
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Profile Fetch Error:", error);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        void loadProfile();

        return () => {
            ignore = true;
        };
    }, [fetchProfile]);

    // Retry Profile Fetch
    const handleRetry = async () => {
        try {
            setLoading(true);
            const user = await fetchProfile();
            setProfile(user);
        } catch (error) {
            console.error("Profile Fetch Error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // Update Profile
    const handleUpdateProfile = async (name: string, image: string) => {
        try {
            setSaving(true);

            const data = await authClient.token();
            const token = data.data?.token;

            if (!token) {
                throw new Error("Authentication required.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/profile`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, image }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Profile update failed."
                );
            }

            setProfile((prev) =>
                prev ? { ...prev, name, image } : prev
            );

            setIsEditOpen(false);
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Profile Update Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2
                    className="animate-spin text-[#000099]"
                    size={32}
                />
            </div>
        );
    }

    // Error State
    if (!profile) {
        return (
            <div className="border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">
                    Unable to load profile information.
                </p>

                <button
                    onClick={handleRetry}
                    className="mt-4 bg-[#000099] px-5 py-2.5 text-sm text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const displayRole =
        profile.role?.trim().toLowerCase() === "user"
            ? "Customer"
            : profile.role;

    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Not available";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        My Profile
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your personal information.
                    </p>
                </div>

                <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex shrink-0 items-center gap-2 bg-[#000099] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-900"
                >
                    <Pencil size={16} />
                    Edit Profile
                </button>
            </div>

            {/* Profile Overview */}
            <div className="border border-gray-200 bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                        {profile.image ? (
                            <Image
                                src={profile.image}
                                alt={profile.name}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <UserRound
                                    size={38}
                                    className="text-gray-400"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {profile.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {profile.email}
                        </p>

                        <span className="mt-3 inline-block bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-[#000099]">
                            {displayRole}
                        </span>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="font-semibold text-gray-900">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Your account details and personal information.
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Full Name
                        </p>

                        <div className="flex items-center gap-3">
                            <UserRound
                                size={18}
                                className="text-gray-400"
                            />
                            <p className="text-sm font-medium text-gray-800">
                                {profile.name}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Email Address
                        </p>

                        <div className="flex items-center gap-3">
                            <Mail
                                size={18}
                                className="text-gray-400"
                            />
                            <p className="break-all text-sm font-medium text-gray-800">
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Account Role
                        </p>

                        <div className="flex items-center gap-3">
                            <ShieldCheck
                                size={18}
                                className="text-gray-400"
                            />
                            <p className="text-sm font-medium capitalize text-gray-800">
                                {displayRole}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Member Since
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                            {memberSince}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reusable Edit Profile Modal */}
            {isEditOpen && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditOpen(false)}
                    onSave={handleUpdateProfile}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default MyProfileCustomer;
