import { updateQuestionById, getAllQuestionsById } from "../../api/editor";

import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { useState } from "react";
import { useParams } from "react-router";

export function EditQuestonButton({ quizId, questionId, description, points, setQuestions }) {
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedPoints, setUpdatedPoints] = useState(0);

    const { id } = useParams();

    function handleClick() {
        setUpdatedDescription(description);
        setUpdatedPoints(points);

        document.getElementById(`edit_question_modal/${questionId}`).showModal();
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const newQuestionData = {
            description: updatedDescription,
            points: updatedPoints,
        };

        try {
            const res = await updateQuestionById(quizId, questionId, newQuestionData);
            const questions = await getAllQuestionsById(id);

            setQuestions(questions.data.questions);

            document.getElementById(`edit_question_modal/${questionId}`).close();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Pencil onClick={handleClick} className="h-[0.8em] hover:opacity-40 cursor-pointer" />
            <dialog onClick={(e) => e.stopPropagation()} id={`edit_question_modal/${questionId}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-base-content/70 text-2xl">Edit Question Details</h3>

                    <p className="mt-2 text-base-content/70">Edit Question</p>

                    <form onSubmit={handleSubmit} className="modal-action flex-col">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-base-content/70 text-lg">Question Description</legend>

                            <textarea
                                autoFocus
                                required
                                type="text"
                                minLength="3"
                                maxLength="1500"
                                className="textarea h-30 w-full resize-none validator"
                                placeholder="Question Description"
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                            />

                            <p className="validator-hint">Description must be between 3 and 1500 characters</p>
                        </fieldset>

                        <div>
                            <legend className="fieldset-legend text-base-content/70 text-lg">Point value</legend>

                            <input className="input validator w-fit" value={updatedPoints} onChange={(e) => setUpdatedPoints(Number(e.target.value))} type="number" min="1" max="100" />
                            <p className="validator-hint">Points must be between 1 and 100 characters</p>
                        </div>
                        <div className="modal-action max-[900px]:block max-[900px]:w-full">
                            <button onClick={() => document.getElementById(`edit_question_modal/${questionId}`).close()} type="reset" className="btn max-[900px]:mb-4 max-[900px]:w-full">
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary max-[900px]:w-full">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}
