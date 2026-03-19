import { useParams } from "react-router";
import { getQuizById } from "../api/quiz";
import { useEffect, useState } from "react";
import { QuizCreatorPage } from "./QuizCreatorPage";
export function QuizDetailPage() {
  const [quiz, setQuiz] = useState(null);
  const [severError, setServerError] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(id);
        setQuiz(data.data);
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
    <div className="flex flex-1 flex-col">
      {/* <h1>{quiz?.name}</h1>
      <p>{quiz?.description}</p>
      <p>{quiz?.automaticDefault}</p>
      <p>{quiz?.createdAt}</p>
      <p>{quiz?.updatedAt}</p> */}

      <QuizCreatorPage
        quizName={quiz?.name}
        description={quiz?.description}
        createdAt={new Date(quiz?.createdAt).toLocaleDateString("en-US")}
        updatedAt={new Date(quiz?.updatedAt).toLocaleDateString("en-US")}
        numQuestions="13"
        id={quiz?.id}
      />
    </div>
  );
}

//   data: {
//                 name: quiz.Name,
//                 description: quiz.Description,
//                 automaticDefault: quiz.AutomaticDefault,
//                 createdAt: quiz.CreatedAt,
//                 updatedAt: quiz.UpdatedAt,
//             },
