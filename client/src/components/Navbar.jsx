import { useAuth } from "../context/AuthContext";
import { truncateText } from "../utility/truncate";

import { Menu } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

export function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Successfully logged out");
    navigate("/");
  }

  return (
    <div className="navbar bg-base-100 shadow-sm rounded-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
            <Menu />
          </div>

          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/join">Join</Link></li>
            {user ? (
              <li>
                <a>{truncateText(user?.name, 10)}</a>
                <ul className="p-2">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
              </li>
            ) : (
              <li>
                <a>Profile</a>
                <ul className="p-2">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              </li>
            )}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl">
          <span>Slide<span className="text-primary">Quiz</span></span>
        </Link>
      </div>

      <div className="navbar-end max-lg:hidden">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/join">Join</Link></li>
          {user ? (
            <li>
              <details>
                <summary>{truncateText(user?.name, 10)}</summary>
                <ul className="p-2">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
              </details>
            </li>
          ) : (
            <li>
              <details>
                <summary>Get Started</summary>
                <ul className="p-2">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              </details>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
