
'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { IService } from '../../../../../type/service';
import { toast } from 'sonner';

interface EditServiceModalProps {
    service: IService;
    onClose: () => void;
}

const EditServiceModal = ({
    service,
    onClose
}: EditServiceModalProps) => {

    const [formData, setFormData] = useState({
        serviceName: service.serviceName,
        category: service.category,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: service.image,
        status: service.status
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: ['price', 'duration'].includes(name)
                ? Number(value)
                : value
        }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:5000/services/${service._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            console.log('PATCH Status:', response.status);
            console.log('PATCH Response:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update service');
            }

            toast.success('Service Updated', {
                description: 'Your service information has been updated successfully.',
            });

            onClose();

        } catch (error) {
            console.error('Update failed:', error);
            alert(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gray-200 bg-white shadow-xl">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5">

                    <div>
                        <h2 className="text-xl font-bold text-[#0B1F54]">
                            Edit Service
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update your service information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 transition hover:text-red-500"
                    >
                        <X size={22} />
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="space-y-5 p-5">

                    {/* Service Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Service Name
                        </label>

                        <input
                            type="text"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#0B1F54]"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#0B1F54]"
                        >
                            <option value="">Select Category</option>
                            <option value="Haircut & Styling">Haircut & Styling</option>
                            <option value="Hair Coloring">Hair Coloring</option>
                            <option value="Hair Treatment">Hair Treatment</option>
                            <option value="Facial & Skincare">Facial & Skincare</option>
                            <option value="Makeup">Makeup</option>
                            <option value="Manicure & Pedicure">Manicure & Pedicure</option>
                            <option value="Spa & Massage">Spa & Massage</option>
                        </select>
                    </div>

                    {/* Price and Duration */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Price (৳)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#0B1F54]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Duration (Minutes)
                            </label>

                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                step="1"
                                required
                                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#0B1F54]"
                            />
                        </div>

                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Image URL
                        </label>

                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#0B1F54]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-[#0B1F54]"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#0B1F54]"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-[#0B1F54] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#163675] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={17} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={17} />
                                    Save Changes
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditServiceModal;
