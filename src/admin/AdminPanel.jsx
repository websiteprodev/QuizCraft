import { Route, Routes } from 'react-router-dom';
import AdminLayout from "./AdminLayout";
import UserManagement from "@/admin/UserManagement";
import RankingModeration from "@/admin/RankingModeration";
import TestManagement from "@/admin/TestManagement";

export function AdminPanel() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="user-management" element={<UserManagement />} />
                <Route path="ranking-moderation" element={<RankingModeration />} />
                <Route path="test-management" element={<TestManagement />} />
            </Routes>
        </AdminLayout>
    );
}

export default AdminPanel;
