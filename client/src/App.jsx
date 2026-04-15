import { HomePage } from "./pages/landing/HomePage";
import { AboutPage } from "./pages/landing/AboutPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

import { Dashboard } from "./pages/user/Dashboard.jsx";
import { SettingsPage } from "./pages/user/SettingsPage";

import { QuizDetailPage } from "./pages/QuizDetailPage.jsx";
import { ResultsPage } from "./pages/ResultsPage.jsx";

import { ClientPage } from "./pages/game/ClientPage.jsx";
import { HostPage } from "./pages/game/HostPage.jsx";

import { PageNotFound } from "./pages/PageNotFound.jsx";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import { useAuth } from "./context/AuthContext.jsx";

import { AnimatePresence } from "motion/react";
import { Routes, Route, useLocation } from "react-router";
import { Toaster } from "sonner";

// TODO: File names are inconsistent

export function App() {
    const { loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex flex-col max-w-[95%] mx-auto pt-4">
            <Toaster richColors position="bottom-right" />
            <Navbar />

            <main className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />

                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />

                        <Route path="join" element={<ClientPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="settings" element={<SettingsPage />} />

                            <Route path="quiz/:id" element={<QuizDetailPage />} />
                            <Route path="quiz/:id/host" element={<HostPage />} />

                            <Route path="results/:id" element={<ResultsPage />} />
                        </Route>

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
