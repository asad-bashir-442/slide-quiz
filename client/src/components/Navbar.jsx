import { Menu } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import { NavLink } from "react-router";

export function Navbar() {
  const { user } = useAuth();

  return (
    <div className="navbar justify-between bg-base-100 shadow-sm rounded-lg">
      <div>
        <div className="flex flex-row items-center gap-3">
          <Menu />
          <Link to="/">
            <p className="text-2xl">
              Slide<span className="text-primary">Quiz</span>
            </p>
          </Link>
        </div>
      </div>
      {user && (
        <nav>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-primary underline" : "text-base-content"
            }
            to="dashboard"
          >
            Dashboard
          </NavLink>
        </nav>
      )}
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
            <button className="btn join-item rounded-lg bg-secondary">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
