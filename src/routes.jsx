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
  UsersIcon  // Добави иконата за групите
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import CreateQuiz from "@/pages/dashboard/CreateQuiz";
import Quizzes from "@/pages/dashboard/Quizzes";
import ProtectedRoute from "./components/ProtectedRoute";
import BrowseQuizzes from "@/pages/dashboard/BrowseQuizzes";
import TakeQuiz from "@/pages/dashboard/TakeQuiz";
import SampleQuiz from "@/pages/dashboard/SampleQuiz";
import GroupList from "@/pages/dashboard/GroupList"; 
import { UserManagement } from "@/admin/UserManagement";



const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      
      {
        icon: <HomeIcon {...icon} />,
        name: "home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      
      {
        icon: <UsersIcon {...icon} />,
        name: "user management",
        path: "/user-management",
        element: (
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      
      
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <PlusCircleIcon {...icon} />,
        name: "create quiz",
        path: "/create-quiz",
        element: (
          <ProtectedRoute>
            <CreateQuiz />
          </ProtectedRoute>
        ),
      },
      {
        icon: <PuzzlePieceIcon {...icon} />,
        name: "quizzes",
        path: "/quizzes",
        element: <Quizzes />,
      },
      {
        icon: <MagnifyingGlassIcon {...icon} />,
        name: "browse quizzes",
        path: "/browse-quizzes",
        element: <BrowseQuizzes />,
      },
      {
        path: "/quiz/:id",
        element: <TakeQuiz />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "sample quiz",
        path: "/sample-quiz",
        element: <SampleQuiz />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "groups",
        path: "/groups",
        element: (
          <ProtectedRoute>
            <GroupList />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
