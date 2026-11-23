
import Image from "next/image";
import {
    UserRound,
    Mail,
    ShieldCheck,
    CalendarDays,
} from "lucide-react";

export interface IProfile {
    _id?: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    createdAt?: string;
}

interface ProfileInformationProps {
    profile: IProfile;
}

const ProfileInformation = ({ profile }: ProfileInformationProps) => {
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Not available";

    // Normalize role name
    const displayRole =
        profile.role?.trim().toLowerCase() === "user"
            ? "Customer"
            : profile.role;

    return (
        <div className="space-y-6">
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
                    {/* Full Name */}
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

                    {/* Email Address */}
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

                    {/* Account Role */}
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

                    {/* Member Since */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Member Since
                        </p>

                        <div className="flex items-center gap-3">
                            <CalendarDays
                                size={18}
                                className="text-gray-400"
                            />

                            <p className="text-sm font-medium text-gray-800">
                                {memberSince}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInformation;
