import { Plus } from "lucide-react";
import { useState } from "react";
import { createQuizQuestion, getAllQuestionsById } from "../../api/editor";

import { toast } from "sonner";

export function NewQuestionButton({ id, setQuiz }) {
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(1);

  async function handleSubmit(e) {
    e.preventDefault();

    const isShortAnswerInput = document.getElementById("is_short_answer");
    // const questionSchema = Joi.object({
    //     description: Joi.string().trim().min(3).max(1500).required(),
    //     shortAnswer: Joi.boolean().required(),
    //     points: Joi.number().min(1).max(100).integer().required(),
    // });

    //     {
    //     "name": "test quiz",
    //     "description": "test quiz description",
    //     "automaticDefault": 1,
    //     "createdAt": "2026-03-20T11:04:45.000Z",
    //     "updatedAt": "2026-03-20T11:04:45.000Z",
    //     "id": 2,
    //     "questions": []
    // }

    // {
    //     "statusCode": 200,
    //     "message": "Quiz details fetched successfully.",
    //     "data": {
    //         "id": 2,
    //         "name": "test quiz",
    //         "description": "test quiz description",
    //         "questions": []
    //     }
    // }

    const questionData = {
      description,
      points,
      shortAnswer: isShortAnswerInput.checked,
    };

    console.log(questionData);

    try {
      const res = await createQuizQuestion(id, questionData);
      const questions = await getAllQuestionsById(id);

      setQuiz((prev) => ({
        ...prev,
        questions: questions.data.questions,
      }));
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
        className="btn btn-primary btn-lg w-[90%] mx-auto"
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
                placeholder="Quiz Name"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <p className="validator-hint">
                Description must be between 3 and 1500 characters
              </p>
            </fieldset>

            <div className="flex flex-col">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base-content/70 text-lg">
                  Is short answer?
                </legend>
                <input
                  id="is_short_answer"
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
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
