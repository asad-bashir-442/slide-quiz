import { Plus } from "lucide-react";
import { useState } from "react";

export function NewQuizButton() {
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  function handleSubmit(e) {
    e.preventDefault();

    const userData = {
      name: quizName,
      ddescription: quizDescription,
    };

    console.log("form submitted");
    console.log(userData);
  }

  function clearForm() {
    setQuizName("");
    setQuizDescription("");
    document.getElementById("my_modal_1").close();
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <Plus />
        Create New Quiz
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-base-content/70 text-2xl">
            Create New Quiz
          </h3>
          <p className="mt-2 text-base-content/70">Insert Quiz Metadata</p>
          <form onSubmit={handleSubmit} className="modal-action flex-col">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_1").close()}
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
                className="input w-full validator"
                placeholder="Quiz Name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
              <p className="validator-hint">Enter valid quiz name</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Quiz Description
              </legend>
              <textarea
                required
                className="textarea h-30 w-full resize-none validator"
                placeholder="Quiz Description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              ></textarea>
              <p className="validator-hint">Enter valid quiz description</p>
            </fieldset>

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
