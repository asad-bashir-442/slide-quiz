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
  const [questions, setQuestions] = useState([]);
  const [severError, setServerError] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(id);

        setQuiz(quizData.data);

        const questionData = await getAllQuestionsById(id);

        setQuestions(questionData.data.questions);
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
        <div className="w-1/4 p-6 bg-base-200 flex flex-col gap-4 max-lg:hidden rounded-xl">
          {questions?.map((question, index) => (
            <QuestionNoButton key={question.id} num={index + 1} />
          ))}
        </div>

        {/* Right column (75%) */}
        <div className="w-3/4 flex flex-col mx-auto">
          <div>
            {questions?.length > 0 ? (
              questions.map((question, index) => (
                <MCQEditor
                  key={question.id || `temp-${index}`}
                  questionNum={index + 1}
                  question={question}
                  setQuestions={setQuestions}
                />
              ))
            ) : (
              <div className="text-center text-primary">
                <Error message="No questions found! Try creating one?" />
              </div>
            )}
          </div>

          {/* <MCQEditor questionName="Example Question" questionNum={13} /> */}
          <NewQuestionButton setQuestions={setQuestions} />
        </div>
      </div>
    </div>
  );
}
