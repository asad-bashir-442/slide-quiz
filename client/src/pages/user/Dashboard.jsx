import { NewQuizButton } from "../../components/dashboard/quiz/buttons/NewQuizButton.jsx";
import { ClearResultsButton } from "../../components/dashboard/results/buttons/ClearResultsButton.jsx";

import { QuizPanel } from "../../components/dashboard/QuizPanel.jsx";
import { ResultsPanel } from "../../components/dashboard/ResultsPanel.jsx";

import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";

export function Dashboard() {
  const { user } = useAuth();

  // TODO:
  // Maybe have a way to automatically load this from the URL?
  // It shouldn't be a separate route.

  // NOTE:
  // True -> Results
  // False -> Quizzes
  const [tabs, setTabs] = useState(false);

  return (
    <div className="w-[90%] mx-auto">
      <div className="mx-auto mt-10 mb-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col md:flex-row md:justify-between md:items-start max-[900px]:text-center max-[900px]:block max-[900px]:p-4">
        {/* Left Column */}
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold mb-2 px-2 p-8 pt-2">
            Welcome, {user.name}
          </h1>

          <h2 className="text-lg opacity-70 mb-4 pb-8 pl-0">
            Manage your quizzes and view results.
          </h2>

          <div className="max-[900px]:flex max-[900px]:justify-center">
            <div className="tabs tabs-box">
              <button
                className={`tab [--tab-bg:theme(colors.primary)] ${!tabs ? 'tab-active' : ''}`}
                onClick={() => setTabs(false)}
              >
                My Quizzes
              </button>
              <button
                className={`tab [--tab-bg:theme(colors.primary)] ${tabs ? 'tab-active' : ''}`}
                onClick={() => setTabs(true)}
              >
                Quiz Results
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-auto">
          { !tabs ? <NewQuizButton /> : <ClearResultsButton /> }
        </div>
      </div>

      { !tabs ? <QuizPanel /> : <ResultsPanel /> }
    </div>
  );
}
