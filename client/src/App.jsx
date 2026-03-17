import { HomePage } from "./pages/HomePage";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { Dashboard } from "./pages/Dashboard.jsx";
import { QuizDetailPage } from "./pages/QuizDetailPage.jsx";
import { QuizCreatorPage } from "./pages/QuizCreatorPage.jsx"; // TODO: Editor

import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { PageNotFound } from "./pages/PageNotFound.jsx";

import { useAuth } from "./context/AuthContext.jsx";

import { Toaster } from "sonner";
import { Routes, Route } from "react-router";

export function App() {
  const { loading } = useAuth();

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="quiz/:id" element={<QuizDetailPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
