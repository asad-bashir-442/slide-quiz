import { Link } from "react-router";
export function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-254.5 bg-base-200 p-6 rounded-lg">
        <div className="flex items-center">
          <form
            className="w-96 bg-base-100 p-8 shadow-2xl flex flex-col gap-6 rounded-2xl"
            action=""
          >
            <div>
              <p className="text-md font-semibold mb-2">Email</p>
              <input
                type="email"
                placeholder="Email"
                className="input input-neutral input-lg rounded-lg"
              />
            </div>

            <div>
              <p className="text-md font-semibold mb-2">Password</p>
              <input
                type="password"
                placeholder="Password"
                className="input input-neutral input-lg rounded-lg"
              />
            </div>

            <button className="btn btn-primary w-full btn-lg rounded-lg">
              Login
            </button>
          </form>

          <div className="mx-auto flex flex-col gap-5">
            <h1 className="text-5xl font-bold">SlideQuiz Login</h1>
            <p className>
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
