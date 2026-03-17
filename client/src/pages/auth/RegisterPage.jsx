import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api/auth";

import { User, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export function RegisterPage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: username,
      email,
      password,
    };

    setIsLoading(true);

    try {
      const res = await registerUser(userData);

      toast.success(res.message);
      login(res.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-254.5 bg-base-200 p-6 rounded-lg max-[900px]:w-full my-4">
        <div className="text-center my-8 min-[900px]:hidden">
          <h1 className="text-3xl font-bold mb-4">SlideQuiz Register</h1>
          <p className="opacity-60">
            Set up your profile to start building interactive quizzes for your presentations.
          </p>
        </div>

        <div className="flex items-center">
          <form
            className="w-96 bg-base-100 p-8 shadow-2xl flex flex-col rounded-2xl max-[900px]:w-full"
            onSubmit={handleSubmit}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Username
              </legend>
              <label className="input validator">
                <User className="text-base-content/70" />
                <input
                  pattern="[A-Za-z0-9]{3,15}"
                  autoFocus
                  required
                  title="Must be between 3-15 characters, Username can only contain letters and digits"
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
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
                  pattern="[A-Za-z0-9]{5,20}"
                  required
                  title="Must be between 5-20 characters, Username can only contain letters and digits"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <p className="validator-hint">Must be between 5-20 characters</p>
            </fieldset>

            <button className="btn btn-primary w-full btn-lg rounded-lg mt-2" disabled={isLoading}>
              {isLoading && <span className="loading loading-spinner loading-xs"></span>}
              Register
            </button>
          </form>

          <div className="mx-auto flex flex-col gap-5 max-[900px]:hidden">
            <h1 className="text-5xl font-bold">SlideQuiz Register</h1>
            <p className="max-w-[48ch]">
              Set up your profile to start building interactive quizzes for your presentations.
            </p>
            <Link to="/login">
              <button className="btn btn-outline btn-secondary btn-wide btn-lg rounded-lg">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
