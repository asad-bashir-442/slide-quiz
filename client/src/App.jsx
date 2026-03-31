import { HomePage } from "./pages/landing/HomePage";
import { AboutPage } from "./pages/landing/AboutPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

import { Dashboard } from "./pages/user/Dashboard.jsx";
import { SettingsPage } from "./pages/user/SettingsPage";

import { QuizDetailPage } from "./pages/QuizDetailPage.jsx";
import { QuizCreatorPage } from "./pages/QuizCreatorPage.jsx"; // TODO: Editor

import { PageNotFound } from "./pages/PageNotFound.jsx";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import { useAuth } from "./context/AuthContext.jsx";

import { Toaster } from "sonner";
import { Routes, Route } from "react-router";
import { JoinPage } from "./pages/JoinPage.jsx";
import { LeaderboardResults } from "./components/dashboard/results/leaderboard/LeaderboardResults.jsx";
import { SessionResultsPanel } from "./components/dashboard/results/session/SessionResultsPanel.jsx";

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
          <Route path="about" element={<AboutPage />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="join" element={<JoinPage />} />
          <Route path="leaderboardTest" element={<SessionResultsPanel />} />

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
