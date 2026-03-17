import { DashWelcomePanel } from "../components/dashboard/DashWelcomePanel.jsx";
import { QuizDetailCard } from "../components/dashboard/QuizDetailCard.jsx";
import { QuizDetailPopup } from "../components/dashboard/QuizDetailPopup.jsx";
import { getAllQuizzes } from "../api/auth.js";
import { useEffect, useState } from "react";

export function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getAllQuizzes(1);
        console.log(data.data);
        setQuizzes(data.data);
      } catch (error) {}
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="w-[90%] mx-auto">
      {/*<button*/}
      {/*    className="btn btn-primary"*/}
      {/*    onClick={() => document.getElementById("edit_quiz_modal").showModal()}*/}
      {/*>*/}
      {/*    View Quiz*/}
      {/*</button>*/}

      {/*<QuizDetailPopup*/}
      {/*    modalId="edit_quiz_modal"*/}
      {/*    quizName="History Quiz"*/}
      {/*    dateCreated="2026-03-01"*/}
      {/*    dateModified="2026-03-05"*/}
      {/*/>*/}
      <DashWelcomePanel />

      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-8 mb-12">
          {quizzes?.map((quiz) => (
            <QuizDetailCard
              key={quiz.id}
              quizName={quiz.name}
              description={quiz.description}
              dateCreated={new Date(quiz.createdAt).toLocaleDateString("en-US")}
              id={quiz.id}
              setQuizzes={setQuizzes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
