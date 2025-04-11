import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";

import FloatingShape from "./components/FloatingShape.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import { useAuthStore } from "../store/authStore.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

//protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

//redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        if (checkAuth) {
            checkAuth();
        }
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br
 from-gray-900 via-gray-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
            >
                <FloatingShape
                    color="bg-green-500"
                    size="w-64 h-64"
                    top="-5%"
                    left="10%"
                    delay={0}
                />
                <FloatingShape
                    color="bg-emerald-500"
                    size="w-48 h-48"
                    top="70%"
                    left="80%"
                    delay={5}
                />
                <FloatingShape
                    color="bg-lime-500"
                    size="w-32 h-32"
                    top="40%"
                    left="-10%"
                    delay={2}
                />
                <FloatingShape
                    color="bg-yellow-500"
                    size="w-34 h-34"
                    top="10%"
                    left="80%"
                    delay={4}
                />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    ></Route>

                    <Route path="/" element={<DashboardPage />} />
                    <Route
                        path="/signup"
                        element={
                            <RedirectAuthenticatedUser>
                                <SignUpPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <RedirectAuthenticatedUser>
                                <LoginPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route path="/verify-email" element={<EmailVerificationPage />} />
                    <Route
                        path="/forgot-password"
                        element={
                            <RedirectAuthenticatedUser>
                                <ForgotPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />


                    <Route
                        path="/reset-password/:token"
                        element={
                            <RedirectAuthenticatedUser>
                                <ResetPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                </Routes>
                <Toaster />
            </div>
        </>
    );
}

export default App;
