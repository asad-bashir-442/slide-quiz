import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { loginUser } from "../api/auth";

export function LoginPage() {
  let navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = { email: "", password: "" };

    if (email.trim().length === 0) {
      newErrors.email = "Email is required";
    }

    if (password.trim().length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      const userData = {
        email,
        password,
      };

      try {
        const data = await loginUser(userData);
        login(data.data.token);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-254.5 bg-base-200 p-6 rounded-lg">
        <div className="flex items-center">
          <form
            className="w-96 bg-base-100 p-8 shadow-2xl flex flex-col gap-6 rounded-2xl"
            onSubmit={handleSubmit}
          >
            <div>
              <p className="text-md font-semibold mb-2">Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-lg rounded-lg focus:outline-primary ${errors.email ? "input-error" : "input-neutral"}`}
              />
              {errors.email && (
                <p className="text-error mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <p className="text-md font-semibold mb-2">Password</p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input input-lg rounded-lg  ${errors.password ? "input-error" : "input-neutral"}`}
              />
              {errors.password && (
                <p className="text-error mt-2">{errors.password}</p>
              )}
            </div>

            <button className="btn btn-primary w-full btn-lg rounded-lg">
              Login
            </button>
          </form>

          <div className="mx-auto flex flex-col gap-5">
            <h1 className="text-5xl font-bold">SlideQuiz Login</h1>
            <p>
              Sign in to access your quizzes and continue where you left off.
            </p>
            <Link to="/register">
              <button className="btn btn-outline btn-secondary btn-wide btn-lg rounded-lg">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
