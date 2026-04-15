export function QuizDetailPopup({ modalId = "edit_quiz_modal", quizName, dateCreated, dateModified }) {
    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg">{quizName}</h3>
                <p className="text-sm opacity-70 mb-4">Enter quiz details</p>

                <div className="flex flex-col gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Quiz Name</span>
                        </label>
                        <input type="text" placeholder="Enter quiz name" className="input input-bordered input-sm w-full" />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea placeholder="Enter quiz description" className="textarea textarea-bordered w-full" rows="3" />
                    </div>

                    <div className="flex gap-2">
                        <span className="badge badge-ghost">Created: {dateCreated}</span>
                        <span className="badge badge-ghost">Modified: {dateModified}</span>
                    </div>
                </div>

                <div className="modal-action justify-between mt-6">
                    <button className="btn btn-secondary">Edit Quiz</button>
                    <button className="btn btn-error">Delete Quiz</button>
                    <button className="btn btn-primary">Done</button>
                    <form method="dialog">
                        <button className="btn">Cancel</button>
                    </form>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
