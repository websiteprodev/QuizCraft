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
import Quizzes from "./pages/dashboard/Quizzes";  // Импортираме Quizzes компонента
import EditQuiz from "./components/EditQuiz";  // Импортираме EditQuiz компонента

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Основен маршрут за потребителското табло */}
                <Route path="/dashboard/*" element={<Home />} />

                {/* Маршрути за регистрация и вход */}
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route path="/auth/sign-in" element={<SignIn />} />
                <Route path="/auth/*" element={<Auth />} />

                {/* Административен панел с вложени маршрути */}
                <Route path="/admin" element={<AdminPanel />}>
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="ranking-moderation" element={<RankingModeration />} />
                    <Route path="test-management" element={<TestManagement />} />
                </Route>

                {/* Маршрути за тестовете */}
                <Route path="/quizzes" element={<Quizzes />} />  {/* Страница за създадени тестове */}
                <Route path="/quizzes/edit/:id" element={<EditQuiz />} />  {/* Страница за редактиране на тест */}

                {/* Маршрут за редактиране на тестове в административния панел */}
                <Route path="/test-management/edit/:id" element={<AdminEditQuiz />} />

                {/* Редирект за невалидни пътища */}
                <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
