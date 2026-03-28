import { X } from "lucide-react";
import { deleteAnswerById, getAllQuestionsById } from "../../api/editor";
import { useParams } from "react-router";
import { toast } from "sonner";
export function MCQInput({
  description,
  isCorrect,
  answerId,
  onChange,
  handleDelete,
  question,
  setQuestions,
}) {
  let { id } = useParams();

  async function handleDelete() {
    console.log(answerId);
    try {
      const res = await deleteAnswerById(id, question?.id, answerId);
      const questions = await getAllQuestionsById(id);
      setQuestions(questions.data.questions);
      toast.success(res.message);
    } catch (error) {
      toast.error(res.message);
    }
  }
  return (
    <div className="flex items-center gap-4 group">
      <button
        type="button"
        onClick={handleDelete}
        className="btn btn-error opacity-20 group-hover:opacity-100"
      >
        <X />
      </button>

      <input
        type="text"
        minLength="3"
        maxLength="500"
        required
        value={description}
        onChange={(e) => onChange({ description: e.target.value, isCorrect })}
        placeholder="Type Response here"
        className="input input-lg w-full text-lg validator"
      />

      <input
        type="checkbox"
        onChange={(e) => onChange({ description, isCorrect: e.target.checked })}
        checked={isCorrect}
        className="toggle toggle-success"
      />
    </div>
  );
}
