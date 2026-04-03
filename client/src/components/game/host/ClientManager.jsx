import { comma } from "../../../utility/numbers";
import { truncateText } from "../../../utility/truncate";

import { User, X, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";

export function ClientManager({ players, responses, kick }) {
    const [main, setMain] = useState({});

    const kicked = () => {
        if (!main.id || !main.username) return;

        kick(main.id, main.username);
        setMain({});
    };

    const points = () => {
        if (!main.id || !main.username || !responses[main.id]) return 0;

        let total = 0;

        responses[main.id].forEach((elm) => {
            total += elm.response.correct ? elm.question.points : 0;
        });

        return total;
    };

    // TODO: Respond date

    const user = main?.id && (
        <div className="w-full p-6 rounded-xl bg-base-200">
            <button
                className="float-right opacity-20 hover:opacity-100"
                onClick={() => setMain({})}
            >
                <X />
            </button>

            <div className="flex align-middle">
                <User className="w-[6em] h-[6em]" />

                <div className="ml-4">
                    <h2 className="text-[2em]">{truncateText(main.username, 10)}</h2>
                    <p className="mb-2 text-xs">
                        <span className="font-bold">Points: </span>
                        <span>{points()}</span>
                    </p>

                    {players.map((p) => p.id).includes(main.id) && (
                        <button
                            className="btn btn-error btn-xs"
                            onClick={kicked}
                        >
                            Kick
                        </button>
                    )}
                </div>
            </div>

            <hr className="my-8 opacity-20" />

            <div className="mt-4">
                <h2 className="text-xl mb-4 font-bold">Responses</h2>

                {(responses[main.id] || []).length == 0 && (
                    <div className="text-center">
                        <h2 className="font-bold opacity-40 text-2xl">No Responses</h2>
                        <h2 className="font-bold mb-8 italic opacity-40 text-lg">Waiting for responses...</h2>
                        <span className="loading loading-ring"></span>
                    </div>
                )}

                {(responses[main.id] || []).map((res) => (
                    <div
                        className="collapse collapse-arrow bg-base-100 border border-base-300"
                        key={res.question.id}
                    >
                        <input type="radio" name="my-accordion-2" checked="checked" />
                        <div className="collapse-title font-semibold">
                            <h2>Q: {truncateText(res.question.description, 50)}</h2>
                            <h4 className="text-xs font-normal">
                                <span className="italic">{res.question.shortAnswer ? "Short Answer, " : ""}</span>
                                <span>
                                    <span>Points: </span>

                                    {res.question.shortAnswer ? res.question.points : (
                                        <span className={res.response.correct ? "text-success" : "text-error"}>
                                            {res.question.points}
                                        </span>
                                    )}
                                </span>
                            </h4>
                        </div>

                        <div className="collapse-content text-sm">
                            <div className={`flex mb-4 ${res.question.shortAnswer ? "hidden" : ""}`}>
                                <div className="inline-block mr-4">
                                    {res.response.correct ? <CircleCheck className="text-success" /> : <CircleX className="text-error" />}
                                </div>

                                <span className="font-bold">{res.response.correct ? "Correct" : "Incorrect"}</span>
                            </div>

                            {res.question.shortAnswer ? (
                                <textarea
                                    className="textarea textarea-primary w-full h-[200px]"
                                    readOnly
                                    value={res.response.answer}
                                />
                            ) : (
                                <div className="p-6 my-6 text-xl bg-base-300 rounded-xl border border-transparent transition duration-200 ease-in-out">
                                    <span className="font-bold">A: </span>
                                    <span>{res.response.answer}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mt-4 flex gap-4">
            <div
                className={`${!main?.id ? "w-full" : "w-[20%]"} p-6 rounded-xl bg-base-200 min-h-[400px]`}
            >
                <h2>
                    <span className="font-bold">Player Count: </span>
                    <span
                        className={players.length == 0 ? "text-error" : "text-success"}
                    >
                        {comma(players.length)}
                    </span>
                </h2>

                <ul className="ml-4 mt-4">
                    {players.map((player) => (
                        <li
                            key={player.id}
                            onClick={() => setMain(player)}
                            className="font-bold"
                        >
                            <span className="hover:opacity-100 opacity-60">
                                <User className="inline-block w-[1em]" /> {truncateText(player.username, 10)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {user}
        </div>
    );
}
