export function HomePage() {
    return (
        <div className="w-[90%] mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

            {/* LEFT COLUMN */}
            <div className="md:col-span-2 space-y-6">

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    Present. Ask. Interact.
                </h1>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-base-content/80">
                    Quizzing + Presenting
                </h2>

                <p className="text-lg md:text-xl lg:text-2xl text-base-content/70 max-w-2xl">
                    Build questions fast, export them instantly, and keep your audience involved without breaking your flow.
                </p>

                {/* JOIN INPUT */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                    <label className="input input-lg flex items-center gap-2 w-full">
                        <span>Join Quiz</span>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Enter a code"
                        />
                    </label>

                    <button className="btn btn-soft btn-lg w-full sm:w-auto">
                        Join
                    </button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="btn btn-outline btn-primary btn-lg">
                        Get Started
                    </button>

                    <button className="btn btn-outline btn-secondary btn-lg">
                        How to use SlideQuiz?
                    </button>
                </div>

            </div>

            {/* RIGHT COLUMN (IMAGE) */}
            <div className="flex justify-center">
                <img
                    src="/images/preview.png"
                    alt="Smartphone with a preview of the SlideQuiz Application"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg"
                />
            </div>

        </div>
    );
}