import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

function AdminLayout() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/dashboard/home'); 
    };

    const linkClasses = ({ isActive }) =>
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <Button onClick={handleGoBack} className="bg-red-500 text-white">
                    Go Back to Website
                </Button>
            </div>
            <div className="flex space-x-4 mb-6">
                <NavLink to="/admin/user-management" className={linkClasses}>
                    <Button>User Management</Button>
                </NavLink>
                <NavLink to="/admin/ranking-moderation" className={linkClasses}>
                    <Button>Ranking Moderation</Button>
                </NavLink>
                <NavLink to="/admin/test-management" className={linkClasses}>
                    <Button>Test Management</Button>
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default AdminLayout;
