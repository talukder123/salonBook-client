
'use client';

import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    serviceName: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal = ({
    serviceName,
    loading,
    onClose,
    onConfirm
}: DeleteConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md border border-gray-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-red-100 text-red-600">
                            <AlertTriangle size={21} />
                        </div>

                        <h2 className="text-lg font-bold text-gray-900">
                            Confirm Deletion
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer text-gray-500 hover:text-gray-800 disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-sm leading-6 text-gray-600">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-gray-900">
                            {serviceName}
                        </span>
                        ? This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 p-5">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-2 bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 size={16} />
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DeleteConfirmModal;