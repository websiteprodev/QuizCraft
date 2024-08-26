import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout"; 
import adminRoutes from "../adminRoutes"; 

export function AdminPanel() {
    return (
        <AdminLayout>
            <Routes>
                {adminRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
                <Route path="*" element={<Navigate to="/admin/user-management" replace />} />
            </Routes>
        </AdminLayout>
    );
}