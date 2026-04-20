import { useState } from "react";

export function RespondState({ currentQuestion, responses, code, respond }) {
    const [response, setResponse] = useState("");
    const [valid, setValid] = useState(false);

    const updateValid = (e) => {
        setResponse(e.target.value);
        setValid(e.target.value.trim().length > 0 && e.target.value.trim().length < 999);
    };

    const answer = () => {
        if (currentQuestion.shortAnswer && !valid) return;

        respond(response);
        setResponse("");
    };

    if (responses.includes(currentQuestion.id)) {
        return (
            <div className="w-full p-6 rounded-xl bg-base-200 my-4 max-w-[1000px] mx-auto">
                <div className="flex justify-between">
                    {!currentQuestion.shortAnswer && <h4 className="text-xs">Points: {currentQuestion.points}</h4>}

                    <h4 className="text-xs">Code: {code}</h4>
                </div>
                <h2 className="text-2xl font-bold my-4 break-words">{currentQuestion.description}</h2>
                <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                    <p className="italic text-primary font-bold opacity-60 my-4 text-xl max-[900px]:text-sm max-[900px]:px-4">You've already responded to this question. Please wait for the next.</p>
                </div>
            </div>
        );
    }

    if (!currentQuestion.shortAnswer && currentQuestion.answers.length === 0) {
        return (
            <div className="w-full p-6 rounded-xl bg-base-200 my-4 max-w-[1000px] mx-auto">
                <div className="flex justify-between">
                    {!currentQuestion.shortAnswer && <h4 className="text-xs">Points: {currentQuestion.points}</h4>}

                    <h4 className="text-xs">Code: {code}</h4>
                </div>
                <h2 className="text-2xl font-bold my-4 break-words">{currentQuestion.description}</h2>
                <div className="text-center py-4 bg-base-300 rounded-xl select-none">
                    <p className="italic text-error opacity-60 my-4 text-2xl font-bold max-[900px]:text-sm max-[900px]:px-4">This question has no answers!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 rounded-xl bg-base-200 my-4 max-w-[1000px] mx-auto">
            <div className="flex justify-between">
                {!currentQuestion.shortAnswer && <h4 className="text-xs">Points: {currentQuestion.points}</h4>}

                <h4 className="text-xs">Code: {code}</h4>
            </div>

            <h2 className="text-2xl font-bold my-4 break-words">{currentQuestion.description}</h2>

            <ol className="list-[upper-alpha] list-inside font-bold">
                {currentQuestion.shortAnswer ? (
                    <>
                        <hr className="my-8 opacity-20" />
                        <textarea placeholder="Short Answer..." className="textarea hover:textarea-primary w-full h-[300px]" onChange={updateValid}></textarea>

                        {!valid && <h4 className="text-xs text-right my-4 text-error opacity-60">Response too short/long! ({response.length}/999)</h4>}

                        <div className="flex my-4 justify-between">
                            <div className="max-[900px]:hidden"></div>
                            <button className="btn btn-primary max-[900px]:btn-outline max-[900px]:w-full" disabled={!valid} onClick={answer}>
                                Submit
                            </button>
                        </div>
                    </>
                ) : (
                    currentQuestion.answers.map((answer) => (
                        <li
                            key={answer.id}
                            onClick={() => respond(answer.id)}
                            className="p-6 my-6 text-xl break-words bg-base-300 rounded-xl border border-transparent transition duration-200 ease-in-out hover:border-primary"
                        >
                            <span className="font-normal">{answer.description}</span>
                        </li>
                    ))
                )}
            </ol>
        </div>
    );
}
