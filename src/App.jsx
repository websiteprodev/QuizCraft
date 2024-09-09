import { Route, Routes, Navigate } from 'react-router-dom';
import { Home, Auth } from '@/layouts';
import { SignIn, SignUp } from './pages/auth';
import React from 'react';
import { AuthProvider } from './pages/auth/authContext';
import AdminPanel from "./admin/AdminPanel";
import UserManagement from "./admin/UserManagement";
import RankingModeration from "./admin/RankingModeration";
import TestManagement from "./admin/TestManagement";
import AdminEditQuiz from "./admin/AdminEditQuiz";
import Quizzes from "./pages/dashboard/Quizzes";  
import EditQuiz from "./components/EditQuiz";
import Comments from './pages/dashboard/Comments'; 
import { OrganizerRoute } from './routes'; // test

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/dashboard/*" element={<Home />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route path="/auth/sign-in" element={<SignIn />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/admin" element={<AdminPanel />}>
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="ranking-moderation" element={<RankingModeration />} />
                    <Route path="test-management" element={<TestManagement />} />
                </Route>
                <Route path="/quizzes" element={<Quizzes />} />  
                <Route path="/quizzes/edit/:id" element={<EditQuiz />} />  
                <Route path="/test-management/edit/:id" element={<AdminEditQuiz />} />
                <Route 
                    path="/comments" 
                    element={
                        <OrganizerRoute>
                            <Comments />
                        </OrganizerRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
