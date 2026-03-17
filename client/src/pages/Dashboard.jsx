import { NewQuizButton } from "../components/dashboard/quiz/buttons/NewQuizButton.jsx";
import { QuizPanel } from "../components/dashboard/QuizPanel.jsx";

import { useAuth } from "../context/AuthContext.jsx";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="w-[90%] mx-auto">
      <div className="mx-auto mt-10 mb-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col md:flex-row md:justify-between md:items-start">
        {/* Left Column */}
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold mb-2 px-2 p-8 pt-2">
            Welcome, {user.name}
          </h1>

          <h2 className="text-lg opacity-70 mb-4 pb-8 pl-0">
            Manage your quizzes and view results.
          </h2>

          <div className="tabs tabs-box">
            <input
              type="radio"
              name="my_tabs_1"
              className="tab  [--tab-bg:theme(colors.primary)]"
              aria-label="My Quizzes"
              defaultChecked
            />

            <input
              type="radio"
              name="my_tabs_1"
              className="tab [--tab-bg:theme(colors.primary)]"
              aria-label="Quiz Results"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-auto">
          <NewQuizButton />
        </div>
      </div>

      <QuizPanel />
    </div>
  );
}
