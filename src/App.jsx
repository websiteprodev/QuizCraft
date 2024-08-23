import { Route, Routes, Navigate } from 'react-router-dom';
import { Home, Auth } from '@/layouts';
import { SignIn, SignUp } from './pages/auth';
import React from 'react';
import { AuthProvider } from './pages/auth/authContext';
import AdminPanel from "./admin/AdminPanel";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/dashboard/*" element={<Home />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/auth/sign-in" element={<SignIn />} />
                <Route path="/admin/*" element={<AdminPanel />} />
                <Route
                    path="*"
                    element={<Navigate to="/dashboard/home" replace />}
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
