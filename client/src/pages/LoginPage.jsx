import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { loginUser } from "../api/auth";
import { Mail, KeyRound } from "lucide-react";

export function LoginPage() {
  let navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

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

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-254.5 bg-base-200 p-6 rounded-lg">
        <div className="flex items-center">
          <form
            className="w-96 bg-base-100 p-8 shadow-2xl flex flex-col rounded-2xl"
            onSubmit={handleSubmit}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Email
              </legend>
              <label className="input validator">
                <Mail className="text-base-content/70" />
                <input
                  required
                  minLength="5"
                  maxLength="30"
                  title="Enter a valid email address"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <p className="validator-hint">Enter a valid email address</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Password
              </legend>
              <label className="input validator">
                <KeyRound className="text-base-content/70" />
                <input
                  pattern="[A-Za-z0-9]{5,10}"
                  minLength="3"
                  maxLength="15"
                  required
                  title="Must be between 3-15 characters, Username can only contain letters and digits"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <p className="validator-hint">Must be between 5-30 characters</p>
            </fieldset>

            <button className="btn btn-primary w-full btn-lg rounded-lg mt-2">
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
