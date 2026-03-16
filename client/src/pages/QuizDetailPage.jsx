import { useParams } from "react-router";
import { getQuizById } from "../api/auth";
import { useEffect, useState } from "react";
export function QuizDetailPage() {
  const [quiz, setQuiz] = useState(null);
  const [severError, setServerError] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await getQuizById(id);
        setQuiz(data.data);
      } catch (error) {
        setServerError(error.message);
      }
    }

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
      <h1>{quiz?.name}</h1>
      <p>{quiz?.description}</p>
      <p>{quiz?.automaticDefault}</p>
      <p>{quiz?.createdAt}</p>
      <p>{quiz?.updatedAt}</p>
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
