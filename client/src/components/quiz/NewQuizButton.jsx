import { Plus } from "lucide-react";
import { useState } from "react";
import { createQuiz } from "../../api/auth";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router";

export function NewQuizButton() {
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  let navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const quizTypeInput = document.getElementById("quiz_type");

    const userData = {
      name: quizName,
      description: quizDescription,
      automatic: quizTypeInput.checked,
    };

    try {
      console.dir(userData);
      const data = await createQuiz(userData);
      toast.success(data.message);
      console.log(`Quiz id ${data.data.id}`);
      navigate(`/quiz/${data.data.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function clearForm() {
    setQuizName("");
    setQuizDescription("");
    document.getElementById("new_quiz_modal").close();
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => document.getElementById("new_quiz_modal").showModal()}
      >
        <Plus />
        Create New Quiz
      </button>
      <dialog id="new_quiz_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-base-content/70 text-2xl">
            Create New Quiz
          </h3>
          <p className="mt-2 text-base-content/70">Insert Quiz Metadata</p>
          <form onSubmit={handleSubmit} className="modal-action flex-col">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("new_quiz_modal").close()}
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

            <div className="flex gap-2">
              <p>Automatic</p>
              <input
                id="quiz_type"
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-primary"
              />
            </div>

            <div className="modal-action">
              <button
                onClick={clearForm}
                type="reset"
                className="btn btn-error"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );

  {
    /* Open the modal using document.getElementById('ID').showModal() method */
  }
}
