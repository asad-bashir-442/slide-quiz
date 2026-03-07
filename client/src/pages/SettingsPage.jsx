import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function SettingsPage() {
  let navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-3xl">Welcome {user.name}</h1>
      <button
        onClick={handleLogout}
        className="btn btn-outline btn-warning justify-self-start"
      >
        Logout
      </button>
    </div>
  );
}
