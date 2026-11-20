"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
}

const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (preview) URL.revokeObjectURL(preview);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    onImageChange(file);
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setPreview(null);
    onImageChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Service Image <span className="text-red-500">*</span>
      </label>

      {preview ? (
        <div className="relative h-52 w-full max-w-sm border border-gray-300">
          <Image
            src={preview}
            alt="Service preview"
            fill
            unoptimized
            className="object-cover"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-red-600 text-white"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-52 w-full max-w-sm flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition hover:border-[#0B1F54] hover:text-[#0B1F54]"
        >
          <ImagePlus size={32} />
          <span className="text-sm font-medium">Choose Service Image</span>
          <span className="text-xs">PNG, JPG or WEBP</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageChange(e.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUpload;