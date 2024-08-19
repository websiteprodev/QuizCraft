import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Auth } from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Home />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
