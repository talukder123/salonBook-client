
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Power,
} from 'lucide-react';
import EditServiceModal from './services/EditServiceModal';
import DeleteConfirmModal from './services/DeleteConfirmModal';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

export interface IService {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface ManageServicesProps {
    services: IService[];
}

const ManageServices = ({ services }: ManageServicesProps) => {

    const router = useRouter();

    const [selectedService, setSelectedService] = useState<IService | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [selectedDeleteService, setSelectedDeleteService] =
        useState<IService | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEditBtn = (service: IService) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    };

    const totalServices = services.length;

    const activeServices = services.filter(
        (service) => service.status === 'active'
    ).length;

    const inactiveServices = services.filter(
        (service) => service.status === 'inactive'
    ).length;

    const handleDelete = async () => {
        if (!selectedDeleteService) return;

        try {
            setDeleteLoading(true);

            const response = await fetch(
                `http://localhost:5000/services/${selectedDeleteService._id}`,
                {
                    method: 'DELETE'
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete service');
            }

            toast.success('Service Deleted', {
                description: `${selectedDeleteService.serviceName} has been deleted successfully.`
            });

            setSelectedDeleteService(null);
            router.refresh();

        } catch (error) {
            toast.error('Delete Failed', {
                description: error instanceof Error
                    ? error.message
                    : 'Something went wrong.'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleStatus = async (service: IService) => {
        const newStatus =
            service.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await fetch(
                `http://localhost:5000/services/${service._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }

            toast.success('Status Updated', {
                description: `${service.serviceName} is now ${newStatus}.`,
            });

            router.refresh();

        } catch (error) {
            toast.error('Update Failed', {
                description: error instanceof Error
                    ? error.message
                    : 'Something went wrong.',
            });
        }
    };


    return (
        <div className="space-y-7 p-4 md:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F54]">
                        Manage Services
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage all salon services from here.
                    </p>
                </div>

                <Link
                    href="/dashboard/admin/services/add"
                    className="flex items-center justify-center gap-2 bg-[#0B1F54] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#163675]"
                >
                    <Plus size={19} />
                    Add New Service
                </Link>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Services
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#0B1F54]">
                        {totalServices}
                    </h2>
                </div>

                <div className="border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Active Services
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        {activeServices}
                    </h2>
                </div>

                <div className="border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Inactive Services
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-red-600">
                        {inactiveServices}
                    </h2>
                </div>

            </div>

            {/* Services Table */}
            <div className="overflow-hidden border border-gray-200 bg-white">

                <div className="border-b border-gray-200 p-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Services
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-5 py-4 font-semibold">
                                    Service
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Category
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Price
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Duration
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-center font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {services.length > 0 ? (
                                services.map((service) => (

                                    <tr
                                        key={service._id}
                                        className="transition hover:bg-gray-50"
                                    >

                                        {/* Service */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">

                                                {service.image ? (
                                                    <Image
                                                        src={service.image}
                                                        alt={service.serviceName}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center bg-gray-100 text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}

                                                <span className="font-medium text-gray-900">
                                                    {service.serviceName}
                                                </span>

                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {service.category}
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4 font-medium text-gray-900">
                                            ৳{service.price}
                                        </td>

                                        {/* Duration */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {service.duration} min
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-medium ${service.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {service.status === 'active'
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-4">

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditBtn(service)}
                                                    className="flex items-center cursor-pointer gap-2 border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[#0B1F54] hover:text-[#0B1F54]"
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </button>

                                                {/* Activate / Deactivate */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(service)}
                                                    title={
                                                        service.status === 'active'
                                                            ? 'Deactivate Service'
                                                            : 'Activate Service'
                                                    }
                                                    className={`flex items-center gap-2 text-sm cursor-pointer font-medium transition ${service.status === 'active'
                                                        ? 'text-gray-700 hover:text-amber-600'
                                                        : 'text-green-600 hover:text-green-700'
                                                        }`}
                                                >
                                                    <Power size={18} />

                                                    {service.status === 'active'
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDeleteService(service)}
                                                    title="Delete Service"
                                                    className="p-2 text-red-500 transition cursor-pointer hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-16 text-center text-gray-500"
                                    >
                                        No services found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500">
                    Showing {services.length} of {services.length} services
                </div>

            </div>

            {isEditModalOpen && selectedService && (
                <EditServiceModal
                    service={selectedService}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {selectedDeleteService && (
                <DeleteConfirmModal
                    serviceName={selectedDeleteService.serviceName}
                    loading={deleteLoading}
                    onClose={() => setSelectedDeleteService(null)}
                    onConfirm={handleDelete}
                />
            )}

        </div>
    );
};

export default ManageServices;
