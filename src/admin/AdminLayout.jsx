import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

function AdminLayout() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/dashboard/home'); 
    };

    const linkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-lg font-semibold ${isActive ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-400 dark:text-gray-800' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`;

    return (
        <div className="p-6 bg-blue-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-blue-700 dark:text-yellow-300">
                    Admin Panel
                </h1>
                <Button
                    onClick={handleGoBack}
                    className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                    Go Back to Website
                </Button>
            </div>
            <div className="flex space-x-4 mb-6">
                <NavLink to="/admin/user-management" className={linkClasses}>
                    <Button className="w-full">User Management</Button>
                </NavLink>
                <NavLink to="/admin/ranking-moderation" className={linkClasses}>
                    <Button className="w-full">Ranking Moderation</Button>
                </NavLink>
                <NavLink to="/admin/test-management" className={linkClasses}>
                    <Button className="w-full">Test Management</Button>
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default AdminLayout;
