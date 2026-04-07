import { Plus } from "lucide-react";
import { useState } from "react";
import { createQuestionById, getAllQuestionsById } from "../../api/editor";

import { toast } from "sonner";
import { useParams } from "react-router";

export function NewQuestionButton({ setQuestions }) {
  const [description, setDescription] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  const [points, setPoints] = useState(1);
  let { id } = useParams();

  async function handleSubmit(e) {
    e.preventDefault();

    const questionData = {
      description,
      points,
      shortAnswer: questionType === "short_answer",
    };

    try {
      const res = await createQuestionById(id, questionData);
      const questions = await getAllQuestionsById(id);

      setQuestions(questions.data.questions);

      document.getElementById("new_question_modal").close();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function clearForm() {
    setDescription("");
    setPoints(1);
    document.getElementById("new_question_modal").close();
  }
  return (
    <>
      <button
        className="btn btn-primary btn-lg w-[90%] mx-auto mt-2"
        onClick={() =>
          document.getElementById("new_question_modal").showModal()
        }
      >
        <Plus />
        ADD QUESTION
      </button>
      <dialog id="new_question_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-base-content/70 text-2xl">
            Create New Question
          </h3>

          <form onSubmit={handleSubmit} className="modal-action flex-col">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base-content/70 text-lg">
                Question Description
              </legend>

              <textarea
                autoFocus
                required
                type="text"
                minLength="3"
                maxLength="1500"
                className="textarea h-30 w-full resize-none validator"
                placeholder="Quiz Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <p className="validator-hint">
                Description must be between 3 and 1500 characters
              </p>
            </fieldset>

            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base-content/70 text-lg">
                  Select Question Type
                </legend>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="question_type"
                    className="radio radio-primary "
                    defaultChecked
                    value="mcq"
                    checked={questionType === "mcq"}
                    onChange={(e) => setQuestionType(e.target.value)}
                  />
                  <span className="text-lg">Multiple Choice</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="question_type"
                    className="radio radio-primary"
                    value="short_answer"
                    checked={questionType === "short_answer"}
                    onChange={(e) => setQuestionType(e.target.value)}
                  />
                  <span className="text-lg">Short Answer</span>
                </div>
              </fieldset>

              <legend className="fieldset-legend text-base-content/70 text-lg">
                Point value
              </legend>

              <input
                className="input validator w-fit"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                type="number"
                min="1"
                max="100"
              />
              <p className="validator-hint">
                Points must be between 1 and 100 characters
              </p>
            </div>
            <div className="modal-action max-[900px]:block max-[900px]:w-full">
              <button
                onClick={clearForm}
                type="reset"
                className="btn max-[900px]:mb-4 max-[900px]:w-full"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary max-[900px]:w-full"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
