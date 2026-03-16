import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";

export function SettingsPage() {
  let navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = { currentPassword: "", newPassword: "" };

    if (currentPassword.trim().length === 0) {
      newErrors.currentPassword = "Field is required";
    }

    if (newPassword.trim().length === 0) {
      newErrors.newPassword = "Field is required";
    }

    setErrors(newErrors);

    if (!newErrors.currentPassword && !newErrors.newPassword) {
      const userData = {
        password: currentPassword,
        newPassword,
      };

      console.log(userData);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 max-w-159.5 flex flex-col items-center gap-6 rounded-lg p-20"
      >
        <h1 className="text-3xl">Welcome {user.name}</h1>

        <div className="w-full">
          <p className="text-sm mb-2 text-base-content/70">Current Password</p>
          <input
            className="bg-base-200 w-full p-3 rounded-lg focus:outline focus:outline-primary"
            type="password"
            placeholder="Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {errors.currentPassword && (
            <p className="text-error mt-2">{errors.currentPassword}</p>
          )}
        </div>

        <div className="w-full">
          <p className="text-sm mb-2 text-base-content/70">New Password</p>
          <input
            className="bg-base-200 w-full p-3 rounded-lg focus:outline focus:outline-primary"
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && (
            <p className="text-error mt-2">{errors.newPassword}</p>
          )}
        </div>

        <div className="mr-auto">
          <input
            type="checkbox"
            value="light"
            className="toggle"
            checked={theme === "light"}
            onChange={toggleTheme}
          />

          <span className="ml-2">Light Mode</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="btn btn-error rounded-lg px-6"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-success rounded-lg px-6">
            Save
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-accent btn-wide"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
