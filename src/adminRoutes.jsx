import UserManagement from "@/admin/UserManagement";
import TestManagement from "@/admin/TestManagement";
import RankingModeration from "@/admin/RankingModeration";
import { UserCircleIcon, TableCellsIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const adminRoutes = [
    {
        icon: <UserCircleIcon {...icon} />,
        name: "User Management",
        path: "user-management",
        element: <UserManagement />,
    },
    {
        icon: <TableCellsIcon {...icon} />,
        name: "Test Management",
        path: "test-management",
        element: <TestManagement />,
    },
    {
        icon: <ShieldCheckIcon {...icon} />,
        name: "Ranking Moderation",
        path: "ranking-moderation",
        element: <RankingModeration />,
    },
];

export default adminRoutes;
