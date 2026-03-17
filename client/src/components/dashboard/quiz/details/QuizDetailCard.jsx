import { DeleteQuizButton } from "../buttons/DeleteQuizButton";
import { truncateText } from "../../../../utility/truncate";

import { useNavigate } from "react-router";

export function QuizDetailCard({
  quizName,
  description,
  dateCreated,
  id,
  setQuizzes,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/quiz/${id}`)}
      className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary cursor-pointer"
    >
      <div className="card-body">
        <h2 className="card-title" title={quizName}>{truncateText(quizName, 25)}</h2>
        <p className="break-words">{description}</p>

        <div className="flex gap-2 mt-2">
          <div className="badge badge-ghost">Created on: {dateCreated}</div>
        </div>

        <div className="card-actions justify-center flex-nowrap gap-3 mt-4">
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-secondary">Download</button>
          <button className="btn btn-accent">Host</button>
          <DeleteQuizButton
            setQuizzes={setQuizzes}
            id={id}
            quizName={quizName}
            description={description}
          />
        </div>
      </div>
    </div>
  );
}
