import { format, formatDistanceToNow } from "date-fns";
import { CircleCheck, CircleX } from "lucide-react";

export function UserPopup({ target }) {
    return (
        <dialog id="responses_modal" className="modal">
            <div className="modal-box w-[80vw] max-w-[1500px] my-8 max-h-[90vh]">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <div>
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        {target.map((o) => (
                            <li key={o.question.id}>
                                <div className="w-full px-4 my-4 flex">
                                    <div className="w-full">
                                        <div className="text-2xl font-bold">
                                            {!o.question.shortAnswer && (
                                                <div className="mr-3 max-[900px]:inline-block hidden">
                                                    {o.response.response.correct ? <CircleCheck className="text-success" /> : <CircleX className="text-error" />}
                                                </div>
                                            )}

                                            <span className={`select-none ${o.question.shortAnswer ? "" : "max-[900px]:hidden"}`}>Q: </span>
                                            <span className="break-words">{o.question.description}</span>
                                        </div>

                                        <div className="text-xs mt-2 font-semibold opacity-60">
                                            <span title={format(o.response.response.timestamp, "PPpp")}>{formatDistanceToNow(o.response.response.timestamp, { addSuffix: true })}</span>
                                            {!o.question.shortAnswer && <span> - {o.question.points} Point(s)</span>}
                                        </div>

                                        <p className="list-col-wrap text-xs mt-4">
                                            {o.question.shortAnswer ? (
                                                <textarea className="textarea active:textarea-primary w-[95%] h-[100px] resize-y" value={o.response.response.answer} readOnly></textarea>
                                            ) : (
                                                <span className="block p-6 text-xl bg-base-300 rounded-xl border border-transparent transition duration-200 ease-in-out">
                                                    <span className="font-bold">A: </span>
                                                    <span>{o.response.response.answer}</span>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {!o.question.shortAnswer && (
                                        <div className="mr-4 max-[900px]:hidden">{o.response.response.correct ? <CircleCheck className="text-success" /> : <CircleX className="text-error" />}</div>
                                    )}{" "}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </dialog>
    );
}
