
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

function AdminLayout() {
    const linkClasses = ({ isActive }) =>
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700';

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <div className="flex space-x-4 mb-6">
                <NavLink to="user-management" className={linkClasses}>
                    <Button>User Management</Button>
                </NavLink>
                <NavLink to="ranking-moderation" className={linkClasses}>
                    <Button>Ranking Moderation</Button>
                </NavLink>
                <NavLink to="test-management" className={linkClasses}>
                    <Button>Test Management</Button>
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default AdminLayout;
