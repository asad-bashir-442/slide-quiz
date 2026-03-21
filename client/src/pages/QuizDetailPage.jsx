import { useParams } from "react-router";
import { getQuizById } from "../api/quiz";
import { getAllQuestionsById } from "../api/editor";
import { useEffect, useState } from "react";
import { Error } from "../components/utility/Error";
import { MCQEditor } from "../components/quiz-creation/MCQEditor";
import { QuestionNoButton } from "../components/quiz-creation/QuestionNoButton";
import { NewQuestionButton } from "../components/editor/NewQuestionButton";
import { ago } from "../utility/date";
export function QuizDetailPage() {
  const [quiz, setQuiz] = useState(null);
  const [severError, setServerError] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(id);
        const questions = await getAllQuestionsById(id);
        const fullQuizData = {
          ...quizData.data,
          ...questions.data,
        };

        setQuiz(fullQuizData);

        console.dir(fullQuizData);
      } catch (error) {
        setServerError(error.message);
      }
    };

    fetchQuiz();
  }, [id]);

  if (severError) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-6xl">404</h1>
        <p>Quiz Not Found</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Top header */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">{quiz?.name}</h1>
        <h2 className="opacity-70">Saved - {ago(quiz?.updatedAt)}</h2>
      </div>

      {/* Two column layout */}
      <div className="flex ">
        {/* Left column (25%) */}
        <div className="w-1/4 p-6 bg-base-200">
          <QuestionNoButton num={1} />
        </div>

        {/* Right column (75%) */}
        <div className="w-3/4 p-6 flex flex-col">
          <div>
            {quiz?.questions?.length ? (
              quiz?.questions?.map((question, index) => (
                <MCQEditor
                  questionId={question.id}
                  quizId={id}
                  key={question.id}
                  description={question.description}
                  questionNum={index + 1}
                  setQuiz={setQuiz}
                />
              ))
            ) : (
              <div className="text-center text-primary">
                <Error message="No questions found! Try creating one?" />
              </div>
            )}
          </div>

          {/* <MCQEditor questionName="Example Question" questionNum={13} /> */}
          <NewQuestionButton id={id} setQuiz={setQuiz} />
        </div>
      </div>
    </div>
  );
}
