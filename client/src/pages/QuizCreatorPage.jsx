import { MCQEditor } from "../components/quiz-creation/MCQEditor.jsx";
import {QuestionNoButton} from "../components/quiz-creation/QuestionNoButton.jsx";

export function QuizCreatorPage() {
    const date = new Date();
    const time = date.getHours() + ':' + date.getMinutes();

    return (
        <div className="w-full">

            {/* Top header */}
            <div className="title p-6 border-b">
                <h1 className="text-3xl font-bold">Quiz Title</h1>
                <h2 className="opacity-70">Saved - {time}</h2>
            </div>

            {/* Two column layout */}
            <div className="flex w-full">

                {/* Left column (25%) */}
                <div className="w-1/4 p-6 border-r bg-base-200">
                    <QuestionNoButton num={1} />
                </div>

                {/* Right column (75%) */}
                <div className="w-3/4 p-6">
                    <MCQEditor questionName="Example Question" questionNum={13} />
                </div>

            </div>
        </div>
    );
}