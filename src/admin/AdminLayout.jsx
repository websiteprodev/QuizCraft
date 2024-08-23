import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { Sidenav, Footer, DashboardNavbar } from "@/widgets/layout";
import adminRoutes from "../adminRoutes"; 

function AdminLayout({ children }) {
    const isAdmin = useAdmin();

    if (!isAdmin) {
        return <Navigate to="/dashboard/home" />;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidenav routes={adminRoutes} />
            <div className="flex-1">
                <DashboardNavbar />
                <div className="p-6">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default AdminLayout;
