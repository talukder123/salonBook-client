
"use client";

import { useState, type FormEvent } from "react";
import ImageUpload from "./imageUpload";
import uploadImage from "@/lib/imgbb";

const categories = [
  "Hair",
  "Skin Care",
  "Nail Care",
  "Makeup",
  "Spa & Massage",
];

const AddServiceForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a service image.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const serviceInfo = {
      serviceName: formData.get("serviceName"),
      category: formData.get("category"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      duration: Number(formData.get("duration")),
    };

    try {
      setLoading(true);

      // Upload image to ImgBB
      const imageUrl = await uploadImage(image);

      // Prepare service data
      const serviceData = {
        ...serviceInfo,
        image: imageUrl,
        status: "active",
      };

      console.log("Service Data:", serviceData);

      alert("Image uploaded successfully!");

    } catch (error) {
      console.error("Service submission error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Service Image */}
      <ImageUpload onImageChange={setImage} />

      {/* Service Information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Service Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Service Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="serviceName"
            placeholder="e.g. Premium Haircut"
            required
            className="h-12 w-full border border-gray-300 px-4 outline-none focus:border-[#0B1F54]"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>

          <select
            name="category"
            required
            defaultValue=""
            className="h-12 w-full border border-gray-300 bg-white px-4 outline-none focus:border-[#0B1F54]"
          >
            <option value="" disabled>
              Select a category
            </option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Price (৳) <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            name="price"
            placeholder="e.g. 800"
            min="0.01"
            step="any"
            required
            className="h-12 w-full border border-gray-300 px-4 outline-none focus:border-[#0B1F54]"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Estimated Duration (Minutes){" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            name="duration"
            placeholder="e.g. 45"
            min="1"
            step="1"
            required
            className="h-12 w-full border border-gray-300 px-4 outline-none focus:border-[#0B1F54]"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>

        <textarea
          name="description"
          rows={5}
          placeholder="Write a detailed description of this service..."
          required
          className="w-full resize-none border border-gray-300 p-4 outline-none focus:border-[#0B1F54]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="h-12 bg-[#0B1F54] px-8 font-medium text-white transition hover:bg-[#142f70] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Service"}
        </button>
      </div>

    </form>
  );
};

export default AddServiceForm;
