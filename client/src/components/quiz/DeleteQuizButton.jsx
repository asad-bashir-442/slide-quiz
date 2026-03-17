import { toast } from "sonner";
import { deleteQuizById, getAllQuizzes } from "../../api/auth";

export function DeleteQuizButton({ id, quizName, description, setQuizzes }) {
  function handleClick(e) {
    e.stopPropagation();
    document.getElementById("delete_quiz_modal").showModal();
  }

  function handleClose() {
    document.getElementById("delete_quiz_modal").close();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await deleteQuizById(id);
      toast.success(data.message);
      handleClose();
      const quizzes = await getAllQuizzes();
      setQuizzes(quizzes.data);
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
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete</h3>
          <p className="py-4">{quizName}</p>
          <p>{description}</p>
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
                <button type="submit" className="btn btn-error">
                  Delete Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
