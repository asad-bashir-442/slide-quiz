import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { updateUser } from "../api/auth";

import { KeyRound, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";

export function SettingsPage() {
  const navigate = useNavigate();

  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();

    toast.success("Successfully logged out");
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() && !email.trim() && !newPassword.trim()) {
      toast.error("Please change at least one field.");
      return;
    }

    const userData = { password: currentPassword };

    if (username.trim()) userData.name = username;
    if (email.trim()) userData.email = email;
    if (newPassword.trim()) userData.newPassword = newPassword;

    setIsLoading(true);

    try {
      const data = await updateUser(userData);

      setIsLoading(false);
      login(data.data.token);

      setUsername("");
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");

      document.getElementById("settings-form").reset();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form
        id="settings-form"
        onSubmit={handleSubmit}
        className="min-[400px]:bg-base-100 flex flex-col my-12.5 items-center rounded-lg px-20 py-10 min-[400px]:shadow max-[400px]:px-8"
      >
        <h1 className="text-3xl mb-2 max-[900px]:text-center">Welcome {user.name}</h1>

        {/* TODO: Profile picture component (just the first letter of the user's name) */}

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content/70 text-lg">
            Current Password*
          </legend>

          <label className="input validator">
            <KeyRound className="text-base-content/70" />
            <input
              pattern="[A-Za-z0-9]{5,20}"
              title="Must be between 5-20 characters, Username can only contain letters and digits"
              type="password"
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <p className="validator-hint">Must be between 5-20 characters</p>
        </fieldset>

        <p className="text-center py-4 italic opacity-40 font-bold border-b mb-8">
          Current password is required to make any changes to your account.
        </p>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content/70 text-lg">
            Username
          </legend>

          <label className="input validator">
            <User className="text-base-content/70" />
            <input
              pattern="[A-Za-z0-9]{3,15}"
              title="Must be between 3-15 characters, Username can only contain letters and digits"
              type="text"
              placeholder="Enter New Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <p className="validator-hint">
            Must be between 3-15 alpha-numeric characters
          </p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content/70 text-lg">
            Email
          </legend>

          <label className="input validator">
            <Mail className="text-base-content/70" />
            <input
              minLength="5"
              maxLength="30"
              title="Enter a valid email address"
              type="email"
              placeholder="Enter New Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <p className="validator-hint">Enter a valid email address</p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-base-content/70 text-lg">
            New Password
          </legend>

          <label className="input validator">
            <KeyRound className="text-base-content/70" />
            <input
              pattern="[A-Za-z0-9]{5,20}"
              title="Must be between 5-20 characters, Username can only contain letters and digits"
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>

          <p className="validator-hint">Must be between 5-20 characters</p>
        </fieldset>

        <div className="mr-auto">
          <input
            type="checkbox"
            value="light"
            className="toggle"
            checked={theme === "light"}
            onChange={toggleTheme}
            disabled={isLoading}
          />

          <span className="ml-2">Light Mode</span>
        </div>

        <div className="opacity-40 border-b mb-8 w-full mt-6"></div>

        <div className="flex justify-between w-full gap-4 max-[900px]:block">
          <button
            type="button"
            onClick={handleLogout}
            className="btn max-[900px]:btn-outline max-[900px]:w-full max-[900px]:btn-accent"
            disabled={isLoading}
          >
            Logout
          </button>

          <div className="flex gap-4 max-[900px]:block">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="btn btn-error rounded-lg px-6 max-[900px]:btn-outline max-[900px]:w-full max-[900px]:my-2"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success rounded-lg px-6 max-[900px]:btn-outline max-[900px]:w-full"
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner loading-xs"></span>}
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
