import { truncateText } from "../../../../utility/truncate";
import { deleteQuizById, getAllQuizzes } from "../../../../api/auth";

import { toast } from "sonner";

export function DeleteQuizButton({ id, quizName, setQuizzes }) {
  const handleClick = (e) => {
    e.stopPropagation();
    document.getElementById("delete_quiz_modal").showModal();
  }

  const handleClose = () => {
    document.getElementById("delete_quiz_modal").close();
  }

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
  }

  return (
    <>
      <button className="btn btn-error" onClick={handleClick}>
        Delete
      </button>
      <dialog
        id="delete_quiz_modal"
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-box">
            <h3 className="font-bold text-lg" title={quizName}>
              Are you sure you want to delete {truncateText(quizName, 15)}
            </h3>
          <p className="text-center pt-4 font-bold">This action is irreversible!</p>
          <div className="modal-action">
            <form onSubmit={handleSubmit}>
              <div className="modal-action">
                <button
                  onClick={handleClose}
                  type="reset"
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                {/* TODO: Maybe an icon here */}
                <button type="submit" className="btn btn-error">
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
