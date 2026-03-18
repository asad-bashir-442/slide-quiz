import { editQuizById, getAllQuizzes } from "../../../../api/auth";
import { useState } from "react";
import { toast } from "sonner";
export function EditQuizButton({
  id,
  name,
  descrption,
  isAutomatic,
  setQuizzes,
}) {
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isChecked, setIsChecked] = useState(isAutomatic);

  function handleClick(e) {
    e.stopPropagation();
    setQuizName(name);
    setQuizDescription(descrption);
    document.getElementById(`edit_quiz_modal/${id}`).showModal();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const quizTypeInput = document.getElementById(`edit_quiz_type/${id}`);

    const quizData = {
      name: quizName,
      description: quizDescription,
      automatic: quizTypeInput.checked,
    };

    try {
      const res = await editQuizById(id, quizData);

      console.dir(res);
      toast.success(res.message);

      const quizzes = await getAllQuizzes();
      setQuizzes(quizzes.data);
      document.getElementById(`edit_quiz_modal/${id}`).close();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <button
        className="btn btn-primary max-[900px]:w-full max-[900px]:btn-outline"
        onClick={handleClick}
      >
        Edit
      </button>
      <dialog
        onClick={(e) => e.stopPropagation()}
        id={`edit_quiz_modal/${id}`}
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-base-content/70 text-2xl">
            Edit Quiz Details
          </h3>

          <p className="mt-2 text-base-content/70">Edit Quiz Metadata</p>

          <form onSubmit={handleSubmit} className="modal-action flex-col">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() =>
                document.getElementById(`edit_quiz_modal/${id}`).close()
              }
            >
              ✕
            </button>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Quiz Name
              </legend>

              <input
                autoFocus
                required
                type="text"
                minLength="3"
                maxLength="50"
                className="input w-full validator"
                placeholder="Quiz Name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />

              <p className="validator-hint">
                Name must be between 3 and 50 characters
              </p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Quiz Description
              </legend>

              <textarea
                required
                minLength="5"
                maxLength="250"
                className="textarea h-30 w-full resize-none validator"
                placeholder="Quiz Description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              ></textarea>

              <p className="validator-hint">
                Description must be between 5 and 250 characters
              </p>
            </fieldset>

            <div className="flex gap-2 items-center w-fit">
              <p>Automatic</p>

              <input
                id={`edit_quiz_type/${id}`}
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </div>

            <div className="modal-action max-[900px]:block max-[900px]:w-full">
              <button
                onClick={() =>
                  document.getElementById(`edit_quiz_modal/${id}`).close()
                }
                type="reset"
                className="btn max-[900px]:mb-4 max-[900px]:w-full"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary max-[900px]:w-full"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
