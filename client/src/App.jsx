import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {Dashboard} from "./pages/Dashboard.jsx";
import { SettingsPage } from "./pages/SettingsPage";
export function App() {
  return (
    <div className="max-w-[95%] mx-auto pt-4 flex flex-col h-full">
      <Navbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
