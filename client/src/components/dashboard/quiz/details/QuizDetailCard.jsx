import { exportQuiz } from "../../../../api/export";
import { save } from "../../../../utility/save";
import { truncateText } from "../../../../utility/truncate";

import { DeleteQuizButton } from "../buttons/DeleteQuizButton";
import { EditQuizButton } from "../buttons/EditQuizButton";

import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function QuizDetailCard({ quizName, description, dateCreated, id, setQuizzes, isAutomatic }) {
    const navigate = useNavigate();

    const download = async () => {
        try {
            const quiz = await exportQuiz(id);

            save(`SlideQuiz-Quiz.csv`, [quiz], { type: "text/csv" });
            toast.success("Quiz exported successfully!");
        } catch (err) {
            toast.error("Failed to export quiz!");
            console.error(err);
        }
    };

    return (
        <div className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary max-[900px]:w-full">
            <div className="card-body">
                <h2 className="card-title overflow-hidden capitalize" title={quizName}>
                    <span>{truncateText(quizName, 25)}</span>
                    <EditQuizButton isAutomatic={isAutomatic} id={id} name={quizName} descrption={description} setQuizzes={setQuizzes} />
                </h2>

                <p className="break-words">{description}</p>

                <div className="flex gap-2 mt-2">
                    <div className="badge badge-ghost">Created on: {dateCreated}</div>
                </div>

                <div className="card-actions justify-center flex-nowrap gap-3 mt-4 max-[900px]:flex-wrap max-[900px]:gap-2">
                    <button onClick={() => navigate(`/quiz/${id}`)} className="btn btn-primary max-[900px]:w-full max-[900px]:btn-outline">
                        Editor
                    </button>

                    <button onClick={download} className="btn btn-secondary max-[900px]:w-full max-[900px]:btn-outline">
                        Download
                    </button>

                    <Link to={`/quiz/${id}/host`} className="btn btn-accent max-[900px]:w-full max-[900px]:btn-outline">
                        Host
                    </Link>

                    <DeleteQuizButton setQuizzes={setQuizzes} id={id} quizName={quizName} />
                </div>
            </div>
        </div>
    );
}
