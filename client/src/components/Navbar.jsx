import { Menu } from "lucide-react";
import { Link } from "react-router";
export function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <div className="flex flex-row items-center gap-3">
          <Menu className="" />
          <Link to="/">
            <p className="text-2xl">
              Slide<span className="text-primary">Quiz</span>
            </p>
          </Link>
        </div>
      </div>
      <div className="join flex-none">
        <Link to="register">
          <button className="btn join-item bg-primary text-primary-content">
            Register
          </button>
        </Link>

        <Link to="login">
          <button className="btn join-item">Login</button>
        </Link>
      </div>
    </div>
  );
}
