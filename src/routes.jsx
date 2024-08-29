import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    PlusCircleIcon,
    PuzzlePieceIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon,
    ServerStackIcon,
    RectangleStackIcon,
    UsersIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import { Home, Profile, Tables, Notifications } from '@/pages/dashboard';
import { SignIn, SignUp } from '@/pages/auth';
import CreateQuiz from '@/pages/dashboard/CreateQuiz';
import Quizzes from '@/pages/dashboard/Quizzes';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseQuizzes from '@/pages/dashboard/BrowseQuizzes';
import TakeQuiz from '@/pages/dashboard/TakeQuiz';
import SampleQuiz from '@/pages/dashboard/SampleQuiz';
import GroupList from '@/pages/dashboard/GroupList';
import AdminLayout from "@/admin/AdminLayout";
import UserManagement from "@/admin/UserManagement";
import RankingModeration from "@/admin/RankingModeration";
import TestManagement from "@/admin/TestManagement";
import EditQuiz from '@/pages/dashboard/EditQuiz';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <AcademicCapIcon {...icon} />,  
                name: 'edit quiz',
                path: '/test-management/edit/:id',
                element: <EditQuiz />, 
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: <Profile />,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: 'tables',
                path: '/tables',
                element: <Tables />,
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: 'notifications',
                path: '/notifications',
                element: <Notifications />,
            },
            {
                icon: <PlusCircleIcon {...icon} />,
                name: 'create quiz',
                path: '/create-quiz',
                element: (
                    <ProtectedRoute>
                        <CreateQuiz />
                    </ProtectedRoute>
                ),
            },
            {
                icon: <PuzzlePieceIcon {...icon} />,
                name: 'quizzes',
                path: '/quizzes',
                element: <Quizzes />,
            },
            {
                icon: <MagnifyingGlassIcon {...icon} />,
                name: 'browse quizzes',
                path: '/browse-quizzes',
                element: <BrowseQuizzes />,
            },
            {
                path: '/quiz/:id',
                element: <TakeQuiz />,
            },
            {
                icon: <AcademicCapIcon {...icon} />,
                name: 'sample quiz',
                path: '/sample-quiz',
                element: <SampleQuiz />,
            },
            {
                icon: <UsersIcon {...icon} />,
                name: 'groups',
                path: '/groups',
                element: (
                    <ProtectedRoute>
                        <GroupList />
                    </ProtectedRoute>
                ),
            },
            {
                icon: <ShieldCheckIcon {...icon} />,
                name: 'admin',
                path: '/dashboard/admin/*', 
                element: (
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: 'user-management',
                        element: <UserManagement />,
                    },
                    {
                        path: 'ranking-moderation',
                        element: <RankingModeration />,
                    },
                    {
                        path: 'test-management',
                        element: <TestManagement />,
                    },
                ],
            },
        ],
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: <SignIn />,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: 'sign up',
                path: '/sign-up',
                element: <SignUp />,
            },
        ],
    },
];

export default routes;
