import { truncateText } from "../../../../utility/truncate";
import { comma } from "../../../../utility/numbers";

import { Copy, User } from "lucide-react";
import { toast } from "sonner";

export function LobbyState({ quiz, game, players, softError, showResults, updateMode, updateResults, kick, start, automatic }) {
    const copy = () => {
        if (!game.code) return;

        navigator.clipboard.writeText(game.code);
        toast.success(`Copied "${game.code}"`);
    };

    return (
        <>
            <div className="w-[90%] mx-auto">
                <div className="mx-auto mt-10 mb-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col md:flex-row md:justify-between md:items-start max-[900px]:text-center max-[900px]:block max-[900px]:p-4">
                    {/* Left Column */}
                    <div className="flex-1 p-4">
                        <h2 className="text-3xl font-bold break-words">{truncateText(quiz?.name || "Unknown Quiz", 25)}</h2>
                        <p className="text-lg my-8 break-words">{truncateText(quiz?.description || "Unknown description...", 150)}</p>

                        <div className="stats min-[900px]:flex gap-4 w-full">
                            <div className="stat rounded-xl shadow bg-base-300 max-w-[125px] max-[900px]:hidden">
                                <div className="stat-title font-bold opacity-60">Players</div>
                                <div className="stat-value">{comma(players.length)}</div>
                            </div>

                            <div className="stat rounded-xl shadow bg-base-300 max-w-[125px] max-[900px]:hidden">
                                <div className="stat-title font-bold opacity-60">Questions</div>
                                <div className="stat-value">{comma(quiz?.questions?.length || 0)}</div>
                            </div>

                            <div className="max-w-[60%] max-[900px]:max-w-full max-[900px]:flex-row text-left">
                                <div className="my-4">
                                    <input
                                        type="checkbox"
                                        value="light"
                                        className="toggle toggle-primary"
                                        checked={automatic}
                                        onChange={updateMode}
                                    />

                                    <span className="ml-4">Automatic Mode?</span>
                                </div>

                                <div className="my-4">
                                    <input
                                        type="checkbox"
                                        value="light"
                                        className="toggle toggle-primary"
                                        checked={showResults}
                                        onChange={updateResults}
                                    />

                                    <span className="ml-4">Show Results?</span>
                                </div>

                                <div className="min-[900px]:hidden">
                                    <h2 className="text-center mt-8">
                                        <span className="font-bold">Player Count: </span>
                                        {comma(players.length)}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="max-[900px]:mt-6 md:mt-0 md:ml-6 flex-row justify-between">
                        <div className="card bg-primary w-[250px] max-[500px]:w-full max-[900px]:mx-auto min-[900px]:mt-[50px]">
                            <div className="card-body">
                                <p className="max-[900px]:text-left">Room Code</p>
                                <h2 className="card-title text-3xl">
                                    <span className="w-full">{game.code || "..."}</span>
                                    <Copy onClick={copy} className="hover:opacity-40" />
                                </h2>
                            </div>
                        </div>

                        <div className="my-[25px]">
                            <h4 className="text-sm opacity-60">{softError}</h4>
                        </div>

                        <div className="flex justify-between">
                            <div className="max-[500px]:hidden"></div>

                            <button
                                className="btn btn-outline btn-success max-[500px]:w-full"
                                disabled={softError != "" || players.length == 0}
                                onClick={start}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[90%] mx-auto">
                <div className="mx-auto mt-2 mb-10 p-6 bg-base-200 rounded-xl text-center shadow-md max-[900px]:block max-[900px]:p-4">
                    {players.length == 0 ?
                        (
                            <>
                                <h1 className="opacity-60 font-bold text-2xl mt-8 select-none">No players yet...</h1>
                                <span className="loading loading-ring loading-lg my-4"></span>
                            </>
                        ) : (
                            players.map((player) => (
                                <div className="text-center bg-base-300 inline-block p-4 m-4 rounded-xl w-[130px] h-[130px]" key={player.id}>
                                    <User className="m-auto" />
                                    <h4 className="text-md font-bold my-2" title={player.username}>{truncateText(player.username, 8)}</h4>
                                    <button
                                        className="btn btn-outline btn-error text-xs"
                                        onClick={() => kick(player.id, player.username)}
                                    >
                                        Kick
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </>
    );
}
