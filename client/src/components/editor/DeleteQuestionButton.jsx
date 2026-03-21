import { truncateText } from "../../utility/truncate";
import { deleteQuestionById } from "../../api/editor";
import { getAllQuestionsById } from "../../api/editor";
import { toast } from "sonner";
export function DeleteQuestionButton({
  questionId,
  description,
  quizId,
  setQuiz,
}) {
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log(`Quiz Id: ${quizId}`);
      console.log(`Question Id: ${questionId}`);
      const res = await deleteQuestionById(quizId, questionId);
      const questions = await getAllQuestionsById(quizId);
      setQuiz((prev) => ({
        ...prev,
        questions: questions.data.questions,
      }));
      document.getElementById(`delete_question_modal/${questionId}`).close();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      <button
        className="btn btn-error max-[900px]:w-full max-[900px]:btn-outline"
        onClick={() =>
          document
            .getElementById(`delete_question_modal/${questionId}`)
            .showModal()
        }
      >
        Delete Question
      </button>
      <dialog id={`delete_question_modal/${questionId}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg" title={description}>
            Are you sure you want to delete "{truncateText(description, 15)}"
          </h3>
          <p className="text-center pt-4 font-bold">
            This action is irreversible!
          </p>
          <div className="modal-action">
            <form onSubmit={handleSubmit} className="max-[900px]:w-full">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() =>
                  document
                    .getElementById(`delete_question_modal/${questionId}`)
                    .close()
                }
              >
                ✕
              </button>

              <div className="modal-action max-[900px]:block max-[900px]:w-full">
                <button
                  onClick={() =>
                    document
                      .getElementById(`delete_question_modal/${questionId}`)
                      .close()
                  }
                  type="reset"
                  className="btn max-[900px]:mb-4 max-[900px]:w-full"
                >
                  Cancel
                </button>

                {/* TODO: Maybe an icon here */}
                <button
                  type="submit"
                  className="btn btn-error max-[900px]:w-full"
                >
                  Yes I know what I'm doing
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
