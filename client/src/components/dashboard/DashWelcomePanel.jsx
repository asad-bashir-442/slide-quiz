export function DashWelcomePanel({ username }) {
    return (
        <div className="w-[90%] mx-auto mt-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col md:flex-row md:justify-between md:items-start">

            {/* Left Column */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold">
                    Welcome, {username}
                </h1>

                <h3 className="text-lg opacity-70 mb-4">
                    Manage your quizzes and view results
                </h3>

                <div role="tablist" className="tabs tabs-box">
                    <a role="tab" className="tab tab-active">My Quizzes</a>
                    <a role="tab" className="tab">Quiz Results</a>
                </div>
            </div>

            {/* Right Column */}
            <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-auto">
                <button className="btn btn-primary w-full md:w-auto">
                    Create Quiz
                </button>
            </div>

        </div>
    );
}