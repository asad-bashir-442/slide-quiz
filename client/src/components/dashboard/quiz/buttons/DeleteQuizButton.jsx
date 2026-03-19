import { truncateText } from "../../../../utility/truncate";
import { getAllQuizzes, deleteQuizById } from "../../../../api/quiz";

import { toast } from "sonner";

export function DeleteQuizButton({ id, quizName, setQuizzes }) {
  const handleClick = (e) => {
    e.stopPropagation();
    document.getElementById(`delete_quiz_modal/${id}`).showModal();
  };

  const handleClose = () => {
    document.getElementById(`delete_quiz_modal/${id}`).close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await deleteQuizById(id);
      const quizzes = await getAllQuizzes();

      setQuizzes(quizzes.data);
      handleClose();

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-error max-[900px]:w-full max-[900px]:btn-outline"
        onClick={handleClick}
      >
        Delete
      </button>
      <dialog
        id={`delete_quiz_modal/${id}`}
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg" title={quizName}>
            Are you sure you want to delete "{truncateText(quizName, 15)}"
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
                  document.getElementById(`delete_quiz_modal/${id}`).close()
                }
              >
                ✕
              </button>

              <div className="modal-action max-[900px]:block max-[900px]:w-full">
                <button
                  onClick={handleClose}
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
