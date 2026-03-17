import { Link, useNavigate } from "react-router";
import { DeleteQuizButton } from "../quiz/DeleteQuizButton";
export function QuizDetailCard({
  quizName,
  description,
  dateCreated,
  numQuestions,
  id,
  setQuizzes,
}) {
  let navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/quiz/${id}`)}
      className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary cursor-pointer"
    >
      <div className="card-body">
        <h2 className="card-title">{quizName}</h2>

        <p>{description}</p>

        <div className="flex gap-2 mt-2">
          <div className="badge badge-ghost">Created on: {dateCreated}</div>
          <div className="badge badge-ghost">{numQuestions} questions</div>
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
          {/* <button onClick={handleDelete} className="btn btn-error">
            Delete
          </button> */}
        </div>
      </div>
    </div>
  );
}
