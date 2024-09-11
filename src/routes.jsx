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
    ChatBubbleLeftRightIcon,
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
import AdminEditQuiz from "@/admin/AdminEditQuiz";
import Comments from "@/pages/dashboard/Comments"; 
import { useAuth } from '@/pages/auth/authContext';
import { Navigate } from 'react-router-dom';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

const OrganizerRoute = ({ children }) => {
    const { role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!role || role !== 'organizer') {

        return <Navigate to="/dashboard/home" replace />;
    }



    return children;
};

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'home',
                path: '/home',
                element: <Home />,
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: <Profile />,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: 'Top Scorers',
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
                name: 'Your Quizzes',
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
                icon: <AcademicCapIcon {...icon} />,
                name: 'sample quiz',
                path: '/sample-quiz',
                element: <SampleQuiz />,
            },
            {
                icon: <ChatBubbleLeftRightIcon {...icon} />,
                name: 'comments',
                path: '/comments',
                element: (
                    <OrganizerRoute>
                        <Comments /> 
                    </OrganizerRoute>
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

export const hiddenRoutes = [
    {
        layout: null, 
        pages: [
            {
                path: '/quiz/:id',
                element: <TakeQuiz />,
            },
            {
                path: '/admin/edit-quiz/:id',
                element: (
                    <ProtectedRoute>
                        <AdminEditQuiz />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];

export default routes;
export { OrganizerRoute };
