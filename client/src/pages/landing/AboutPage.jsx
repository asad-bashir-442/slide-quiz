import { useEffect } from "react";
import { Link } from "react-router";

export function AboutPage() {
    useEffect(() => {
        document.title = "SlideQuiz | About";
    });

    return (
        <div className="w-[90%] md:w-[80%] mx-auto mt-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">About SlideQuiz</h1>

                <Link to="/" className="btn btn-outline btn-primary btn-lg">
                    Go Back
                </Link>
            </div>

            <div className="card bg-base-200 shadow-md w-full">
                <div className="card-body grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="md:col-span-3 space-y-4">
                        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-base-content/80">
                            SlideQuiz is a web application designed to simplify the process of creating and hosting quizzes during live presentations. It provides tools that allow instructors and
                            presenters to insert questions directly into their slides, enabling real-time participation from students or audiences.
                            <br />
                            <br />
                            SlideQuiz offers detailed control over how quizzes are delivered. Users can choose from multiple question types and apply advanced formatting options for text, equations,
                            and code, making the tool adaptable to a wide range of subjects and presentation styles.
                            <br />
                            <br />
                            SlideQuiz focuses on flexibility, customization, and ease of use, supporting a more interactive and structured approach to presenting questions in classroom or presentation
                            settings.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <img src="/images/about.png" alt="Figure giving a presentation" className="w-full max-w-xs md:max-w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
