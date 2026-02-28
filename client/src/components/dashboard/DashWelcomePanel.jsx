export function DashWelcomePanel({ username }) {
    return (
        <div className="w-[90%] mx-auto mt-10 p-6 bg-base-200 rounded-xl shadow-md flex justify-between items-start">

            {/* Left Column */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold">Welcome, {username}</h1>
                <h3 className="text-lg opacity-70 mb-4">
                    Manage your quizzes and view results
                </h3>

                <div role="tablist" className="tabs tabs-box">
                    <a role="tab" className="tab tab-active">My Quizzes</a>
                    <a role="tab" className="tab">Quiz Results</a>
                </div>
            </div>

            {/* Right Column */}
            <div className="ml-6">
                <button className="btn btn-primary">
                    Create Quiz
                </button>
            </div>

        </div>
    );
}