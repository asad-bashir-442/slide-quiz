import { ClientManager } from "../ClientManager";
import { SquareArrowRightExit, Settings, ArrowRight } from "lucide-react";

export function ManualState({ code, allQuestions, currentQuestion, players, disconnectedPlayers, responses, kick, getQuestionIndex, end, jump, jumpNext }) {
    const toggleModal = () => document.getElementById("client_manager_modal").showModal();

    return (
        <>
            <dialog id="client_manager_modal" className="modal">
                <div className="modal-box w-[80vw] max-w-full my-8 max-h-[90vh]">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <div className="min-[900px]:hidden">
                        <h2 className="text-xl font-bold mb-8">Question Jumper</h2>

                        {allQuestions.map((question) => (
                            <label className="label mx-2 bg-base-200 p-2 m-1 rounded-lg" key={question.id}>
                                <input
                                    className="radio radio-sm radio-primary"
                                    type="radio"
                                    name="radio-questions-mobile"
                                    checked={currentQuestion.id == question.id}
                                    onClick={() => jump(question.id)}
                                />

                                <span className="label-text ml-2">
                                    <span className="max-[1500px]:hidden">Question</span> #{getQuestionIndex(question.id) + 1}
                                </span>
                            </label>
                        ))}

                        <h2 className="text-xl font-bold mt-8">User Manager</h2>
                    </div>

                    <ClientManager players={players} disconnectedPlayers={disconnectedPlayers} responses={responses} kick={kick} />

                    <button className="min-[900px]:hidden btn btn-error btn-outline mt-4 w-full" onClick={end}>
                        <SquareArrowRightExit />
                        <span>End</span>
                    </button>
                </div>
            </dialog>

            <div className="mt-10 mb-10 flex gap-4 overflow-hidden">
                <div className="w-[20%] max-w-[250px] p-6 rounded-xl bg-base-200 flex flex-col justify-between min-h-[400px] shrink-0 max-[900px]:hidden">
                    <div>
                        {allQuestions.map((question) => (
                            <label className="label block my-2" key={question.id}>
                                <input className="radio radio-xl radio-primary" type="radio" name="radio-questions" checked={currentQuestion.id == question.id} onClick={() => jump(question.id)} />

                                <span className="label-text ml-2">
                                    <span className="max-[1500px]:hidden">Question</span> #{getQuestionIndex(question.id) + 1}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div>
                        <button className="btn btn-primary mt-4 w-full" onClick={toggleModal}>
                            <Settings />
                            <span>Host Settings</span>
                        </button>

                        <button className="btn btn-error mt-4 w-full" onClick={end}>
                            <SquareArrowRightExit />
                            <span>End</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-w-0 p-6 rounded-xl bg-base-200">
                    <button className="btn btn-primary float-right max-[900px]:scale-80" onClick={jumpNext} disabled={currentQuestion.id == allQuestions[allQuestions.length - 1]?.id}>
                        <ArrowRight />
                        <span className="max-[900px]:hidden">Next Question</span>
                    </button>

                    <button className="btn btn-secondary float-right min-[900px]:hidden scale-80" onClick={toggleModal}>
                        <Settings />
                    </button>

                    <h4>
                        Question {getQuestionIndex(currentQuestion.id) + 1} <span className="opacity-60">#{code}</span>
                    </h4>
                    <h2 className="text-2xl font-bold my-4 break-words">{currentQuestion.description}</h2>

                    <ol className="list-[upper-alpha] list-inside font-bold">
                        {!currentQuestion.shortAnswer && currentQuestion.answers.length == 0 ? (
                            <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                                <p className="italic text-error opacity-60 my-4 text-2xl">This question has no answers!</p>
                            </div>
                        ) : (
                            <></>
                        )}

                        {currentQuestion.shortAnswer ? (
                            <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                                <p className="italic opacity-60 my-4 text-2xl">Short Answer</p>
                                <p className="opacity-60 my-4 text-lg">Please type a response.</p>
                            </div>
                        ) : (
                            currentQuestion.answers.map((answer) => (
                                <li key={answer.id} className="p-6 my-6 text-xl bg-base-300 rounded-xl break-words overflow-hidden">
                                    <span className="font-normal break-words">{answer.description}</span>
                                </li>
                            ))
                        )}
                    </ol>
                </div>
            </div>
        </>
    );
}
