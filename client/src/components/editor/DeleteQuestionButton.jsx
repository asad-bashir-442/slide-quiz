import { truncateText } from "../../utility/truncate";
import { deleteQuestionById } from "../../api/editor";
import { getAllQuestionsById } from "../../api/editor";
import { useParams } from "react-router";
import { toast } from "sonner";

export function DeleteQuestionButton({ question, setQuestions }) {
  let { id } = useParams();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log(`Quiz Id: ${id}`);
      console.log(`Question Id: ${question?.id}`);
      const res = await deleteQuestionById(id, question?.id);
      const questions = await getAllQuestionsById(id);

      setQuestions(questions.data.questions);

      console.dir(questions);
      document.getElementById(`delete_question_modal/${question?.id}`).close();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      <button
        className="btn btn-error max-lg:w-full max-[900px]:w-full max-lg:btn-outline rounded-md"
        onClick={() =>
          document
            .getElementById(`delete_question_modal/${question?.id}`)
            .showModal()
        }
      >
        Delete Question
      </button>
      <dialog id={`delete_question_modal/${question?.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg" title={question?.description}>
            Are you sure you want to delete "
            {truncateText(question?.description, 15)}"
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
                    .getElementById(`delete_question_modal/${question?.id}`)
                    .close()
                }
              >
                ✕
              </button>

              <div className="modal-action max-[900px]:block max-[900px]:w-full">
                <button
                  onClick={() =>
                    document
                      .getElementById(`delete_question_modal/${question?.id}`)
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
