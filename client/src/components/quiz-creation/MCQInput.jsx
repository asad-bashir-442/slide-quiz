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
  index,
  question,
  setQuestions,
  letter,
  deleteTempAnswer,
}) {
  let { id } = useParams();

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
    <div className="flex items-center gap-4 border border-transparent group bg-base-200 p-6 rounded-2xl focus-within:border-primary relative">
      <button
        type="button"
        onClick={handleDelete}
        className="btn btn-sm btn-error group-hover:opacity-20 hover:opacity-100 opacity-0 absolute group-focus-within:opacity-20 focus:opacity-100 translate-x-5 -translate-y-5  right-0 top-0 btn-circle"
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
          onChange={(e) =>
            onChange({ description: e.target.value, correct, id: answerId })
          }
          placeholder="Type Response here"
          className="input input-ghost input-lg w-full validator text-3xl outline-0 bg-base-200"
        />
        <input
          type="checkbox"
          onChange={(e) =>
            onChange({ description, correct: e.target.checked, id: answerId })
          }
          checked={correct}
          className="toggle toggle-success"
        />
      </div>
    </div>
  );
}
