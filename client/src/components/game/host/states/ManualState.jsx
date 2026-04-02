import { SquareArrowRightExit } from "lucide-react";

export function ManualState({ allQuestions, currentQuestion, getQuestionIndex, end, jump, jumpNext }) {
    return (
        <div className="mt-10 mb-10 flex gap-4 overflow-hidden">
            <div className="w-[20%] max-w-[250px] p-6 rounded-xl bg-base-200 flex flex-col justify-between min-h-[400px] shrink-0">
                <div>
                    {allQuestions.map((question) => (
                        <label className="label block my-2" key={question.id}>
                            <input
                                className="radio radio-xl radio-primary"
                                type="radio"
                                name="radio-questions"
                                checked={currentQuestion.id == question.id}
                                onClick={() => jump(question.id)}
                            />

                            <span className="label-text ml-2">
                                <span className="max-[1500px]:hidden">Question</span> #{getQuestionIndex(question.id) + 1}
                            </span>
                        </label>
                    ))}
                </div>

                <button className="btn btn-error mt-4" onClick={end}>
                    <SquareArrowRightExit />
                    <span>End</span>
                </button>
            </div>

            <div className="flex-1 min-w-0 p-6 rounded-xl bg-base-200">
                <button
                    className="btn btn-primary float-right"
                    onClick={jumpNext}
                    disabled={currentQuestion.id == allQuestions[allQuestions.length - 1]?.id}
                >
                    Next Question
                </button>

                <h4>Question {getQuestionIndex(currentQuestion.id) + 1}</h4>
                <h2 className="text-2xl font-bold my-4 break-words">{currentQuestion.description}</h2>

                <ol className="list-[upper-alpha] list-inside font-bold">
                    {!currentQuestion.shortAnswer && currentQuestion.answers.length == 0 ?
                        <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                            <p className="italic text-error opacity-60 my-4 text-2xl">This question has no answers!</p>
                        </div> : <></>
                    }

                    {currentQuestion.shortAnswer ? (
                        <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                            <p className="italic opacity-60 my-4 text-2xl">Short Answer</p>
                            <p className="opacity-60 my-4 text-lg">Please type a response.</p>
                        </div>
                    ) : (
                        currentQuestion.answers.map((answer) => (
                            <li
                                key={answer.id}
                                className="p-6 my-6 text-xl bg-base-300 rounded-xl break-words overflow-hidden"
                            >
                                <span className="font-normal break-words">{answer.description}</span>
                            </li>
                        ))
                    )}
                </ol>
            </div>
        </div>
    );
}
