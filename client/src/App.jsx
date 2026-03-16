import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Dashboard } from "./pages/Dashboard.jsx";
import { SettingsPage } from "./pages/SettingsPage";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { QuizCreatorPage } from "./pages/QuizCreatorPage.jsx";
import { QuizDetailPage } from "./pages/QuizDetailPage.jsx";
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
    <div className="max-w-[95%] mx-auto pt-4 flex flex-col h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="quizCreator" element={<QuizCreatorPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="quiz/:id" element={<QuizDetailPage />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}
