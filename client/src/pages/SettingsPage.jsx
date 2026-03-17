import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";
import { KeyRound, User, Mail } from "lucide-react";
import { updateUser } from "../api/auth";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleLogout() {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() && !email.trim() && !newPassword.trim()) {
      toast.error("Please change at least one field.");
      return;
    }

    const userData = {
      password: currentPassword,
    };

    if (username.trim()) {
      userData.name = username;
    }

    if (email.trim()) {
      userData.email = email;
    }

    if (newPassword.trim()) {
      userData.newPassword = newPassword;
    }

    console.log(userData);

    try {
      const data = await updateUser(userData);
      login(data.data.token);
      setUsername("");
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      document.getElementById("settings-form").reset();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        id="settings-form"
        onSubmit={handleSubmit}
        className="bg-base-100 max-w-159.5 flex flex-col items-center rounded-lg p-20"
      >
        <h1 className="text-3xl mb-2">Welcome {user.name}</h1>

        <div className="flex gap-2">
          <fieldset className="fieldset flex-1">
            <legend className="fieldset-legend text-base-content/70 text-lg">
              Username
            </legend>
            <label className="input validator">
              <User className="text-base-content/70" />
              <input
                pattern="[A-Za-z0-9]{3,15}"
                autoFocus
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
          <fieldset className="fieldset flex-1">
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
        </div>

        <div className="flex gap-2">
          <fieldset className="fieldset flex-1">
            <legend className="fieldset-legend text-base-content/70 text-lg">
              Current Password
            </legend>
            <label className="input validator">
              <KeyRound className="text-base-content/70" />
              <input
                pattern="[A-Za-z0-9]{5,20}"
                required
                title="Must be between 5-20 characters, Username can only contain letters and digits"
                type="password"
                placeholder="Enter Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <p className="validator-hint">Must be between 5-20 characters</p>
          </fieldset>
          <fieldset className="fieldset flex-1">
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

        <div className="flex items-center gap-4 my-6">
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
