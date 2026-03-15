export function MCQEditor({ questionName, questionNum }) {
    return (
        <div className="w-[90%] mx-auto mt-10 mb-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col gap-6">

            {/* Top row */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg opacity-70">
                    Question {questionNum}
                </h3>

                <h1 className="text-2xl font-bold">
                    {questionName}
                </h1>

                <button className="btn btn-error">
                    Delete Question
                </button>
            </div>

            {/* Response inputs */}
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Type Response here"
                    className="input input-bordered input-lg w-full text-lg"
                />

                <input
                    type="text"
                    placeholder="Type Response here"
                    className="input input-bordered input-lg w-full text-lg"
                />
            </div>

            {/* Add Response Button */}
            <button className="btn btn-primary btn-lg self-start">
                Add New Response
            </button>

        </div>
    );
}