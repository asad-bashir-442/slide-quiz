export function QuizDetailPopup({modalId = "edit_quiz_modal", quizName, dateCreated, dateModified}) {
    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-lg">

                {/* Title */}
                <h3 className="font-bold text-lg">{quizName}</h3>

                {/* Prompt */}
                <p className="text-sm opacity-70 mb-4">Enter quiz details</p>

                {/* Form */}
                <div className="flex flex-col gap-4">

                    {/* Quiz Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Quiz Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter quiz name"
                            className="input input-bordered input-sm w-full"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            placeholder="Enter quiz description"
                            className="textarea textarea-bordered w-full"
                            rows="3"
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <span className="badge badge-primary">Created: {dateCreated}</span>
                        <span className="badge badge-secondary">Modified: {dateModified}</span>
                    </div>

                </div>

                {/* Buttons */}
                <div className="modal-action justify-between mt-6">
                    <button className="btn btn-neutral">Edit Quiz</button>
                    <button className="btn btn-errpr">Delete Quiz</button>
                    <button className="btn btn-secondary">Cancel</button>
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>

            </div>

            {/* backdrop click closes */}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}