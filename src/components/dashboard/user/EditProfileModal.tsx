
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import type { IProfile } from "./customerProfile";
import uploadImage from "@/lib/imgbb";

interface EditProfileModalProps {
    profile: IProfile;
    onClose: () => void;
    onSave: (name: string, image: string) => Promise<void>;
    saving: boolean;
}

const EditProfileModal = ({
    profile,
    onClose,
    onSave,
    saving,
}: EditProfileModalProps) => {
    const [name, setName] = useState(profile.name);
    const [image, setImage] = useState(profile.image || "");
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            e.target.value = "";
            return;
        }

        try {
            setUploading(true);

            const imageUrl = await uploadImage(file);

            setImage(imageUrl);

            toast.success("Profile image uploaded successfully.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Image upload failed."
            );
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (uploading) return;

        await onSave(name, image);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg border border-gray-200 bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Profile
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update your personal information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving || uploading}
                        className="text-gray-500 hover:text-gray-900"
                        aria-label="Close modal"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#000099]"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Email address cannot be changed.
                        </p>
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Profile Image
                        </label>

                        <div className="flex items-center gap-3">
                            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-gray-100">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt="Profile preview"
                                        fill
                                        unoptimized
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <ImagePlus
                                        size={22}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>

                            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-gray-300 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                {uploading ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={17} />
                                        Choose Image
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading || saving}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Choose an image from your device.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving || uploading}
                            className="border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || uploading || !name.trim()}
                            className="flex items-center gap-2 bg-[#000099] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-50"
                        >
                            {(saving || uploading) && (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            )}

                            {saving
                                ? "Saving..."
                                : uploading
                                  ? "Uploading..."
                                  : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
