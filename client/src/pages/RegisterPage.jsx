import { useEffect, useState } from "react";
import { Link } from "react-router";
export function RegisterPage() {
  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    if (username.trim().length < 5) {
      newErrors.username = "Username must be at least 5 characters";
    }

    if (password.trim().length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    if (email.trim().length === 0) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.email && !newErrors.password) {
      const userData = {
        username,
        email,
        password,
      };
      console.log(userData);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="bg-base-200 p-6 rounded-lg">
        <div className=" flex items-center gap-16">
          <form
            className="w-96 bg-base-100 p-8 shadow-2xl flex flex-col gap-6 rounded-2xl"
            onSubmit={handleSubmit}
          >
            <div>
              <p className="text-md font-semibold mb-2">Username</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setuserName(e.target.value)}
                placeholder="Username"
                className={`input input-lg rounded-lg ${errors.username ? "input-error" : "input-neutral"}`}
              />
              {errors.username && (
                <p className="text-error mt-2">{errors.username}</p>
              )}
            </div>

            <div>
              <p className="text-md font-semibold mb-2">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`input input-lg rounded-lg ${errors.email ? "input-error" : "input-neutral"}`}
              />
              {errors.email && (
                <p className="text-error mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <p className="text-md font-semibold mb-2">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`input input-lg rounded-lg ${errors.password ? "input-error" : "input-neutral"}`}
              />
              {errors.password && (
                <p className="text-error mt-2">{errors.password}</p>
              )}
            </div>

            <button className="btn btn-primary w-full btn-lg rounded-lg">
              Register
            </button>
          </form>

          <div className="mx-auto flex flex-col gap-5">
            <h1 className="text-5xl font-bold">SlideQuiz Register</h1>
            <p className="max-w-[48ch]">
              Set up your profile to start building interactive quizzes for your
              presentations.
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
