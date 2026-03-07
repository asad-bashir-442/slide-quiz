import { Menu } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
export function Navbar() {
  const { user } = useAuth();
  return (
    <div className="navbar bg-base-100 shadow-sm rounded-lg">
      <div className="flex-1">
        <div className="flex flex-row items-center gap-3">
          <Menu />
          <Link to="/">
            <p className="text-2xl">
              Slide<span className="text-primary">Quiz</span>
            </p>
          </Link>
        </div>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6" />

          <Link to="/settings">
            <div className="avatar avatar-placeholder">
              <div className="bg-secondary text-neutral-content w-12 rounded-full">
                <span className="text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="join flex-none">
          <Link to="/register">
            <button className="btn join-item bg-primary text-primary-content rounded-lg">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="btn join-item rounded-lg">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}
