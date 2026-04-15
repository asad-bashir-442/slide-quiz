import { deleteAnswerById, getAllQuestionsById } from "../../api/editor";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { useParams } from "react-router";

export function MCQInput({ description, correct, answerId, onChange, index, question, setQuestions, deleteTempAnswer }) {
    const { id } = useParams();

    async function handleDelete() {
        if (!answerId) {
            deleteTempAnswer(index);
            return;
        }
        try {
            const res = await deleteAnswerById(id, question?.id, answerId);
            const questions = await getAllQuestionsById(id);

            setQuestions(questions.data.questions);
            toast.success(res.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <motion.li className="text-3xl gap-4 border border-transparent group bg-base-200 p-6 rounded-2xl focus-within:border-primary relative my-4">
            <button
                type="button"
                onClick={handleDelete}
                className="btn btn-sm btn-error group-hover:opacity-20 hover:opacity-100 opacity-0 absolute group-focus-within:opacity-20 focus:opacity-100 translate-x-5 -translate-y-5  right-0 top-0 btn-circle"
            >
                <X />
            </button>

            <div className="inline-flex items-center w-[90%]">
                <input
                    type="text"
                    minLength="3"
                    maxLength="500"
                    required
                    value={description}
                    onChange={(e) => onChange({ description: e.target.value, correct, id: answerId })}
                    placeholder="Type Response here"
                    className="input input-ghost input-lg w-full validator text-3xl outline-0 bg-base-200"
                />

                <input type="checkbox" onChange={(e) => onChange({ description, correct: e.target.checked, id: answerId })} checked={correct} className="toggle toggle-success" />
            </div>
        </motion.li>
    );
}
