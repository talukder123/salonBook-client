
import React from 'react';
import ManageServices from '@/components/dashboard/admin/manageServices';

const AdminServicePage = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch services');
    }

    const data = await res.json();

    const services = Array.isArray(data)
        ? data
        : data.services ?? [];

    return (
        <div>
            <ManageServices services={services} />
        </div>
    );
};

export default AdminServicePage;
