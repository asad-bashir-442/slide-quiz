import { X } from "lucide-react";
import { deleteAnswerById, getAllQuestionsById } from "../../api/editor";
import { useParams } from "react-router";
import { toast } from "sonner";
import { numberToLetter } from "../../utility/numbers";
export function MCQInput({
  description,
  correct,
  answerId,
  onChange,

  question,
  setQuestions,
  letter,
}) {
  let { id } = useParams();

  async function handleDelete() {
    const questions = await getAllQuestionsById(id);
    if (!answerId) {
      setQuestions(questions.data.questions);
      toast.success("Removed Question");
      return;
    }
    try {
      const res = await deleteAnswerById(id, question?.id, answerId);

      setQuestions(questions.data.questions);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex items-center gap-4 group bg-base-200 p-6 rounded-2xl relative">
      <button
        type="button"
        onClick={handleDelete}
        className="btn btn-sm btn-error opacity-0 absolute group-hover:opacity-20 translate-x-5 -translate-y-5 hover:opacity-100  right-0 top-0 btn-circle"
      >
        <X />
      </button>

      <div className="flex items-center w-full">
        <span className="text-3xl">{`${numberToLetter(letter)}.`}</span>

        <input
          type="text"
          minLength="3"
          maxLength="500"
          required
          value={description}
          onChange={(e) => onChange({ description: e.target.value, correct })}
          placeholder="Type Response here"
          className="input input-ghost input-lg w-full validator text-3xl outline-0 bg-base-200"
        />
        <input
          type="checkbox"
          onChange={(e) => onChange({ description, correct: e.target.checked })}
          checked={correct}
          className="toggle toggle-success"
        />
      </div>
    </div>
  );
}
