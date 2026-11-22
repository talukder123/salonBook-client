
import CheckJWT from '@/components/checkJwt';
import React from 'react';

const AdminDashboardPage = () => {
    return (
        <div>
            Admin dashboard Overview
            <CheckJWT></CheckJWT>
        </div>
    );
};

export default AdminDashboardPage;