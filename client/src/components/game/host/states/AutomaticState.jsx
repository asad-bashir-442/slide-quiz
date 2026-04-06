import { ClientManager } from "../ClientManager";

import { SquareArrowRightExit } from "lucide-react";

export function AutomaticState({ code, players, disconnectedPlayers, responses, kick, end }) {
    return (
        <div>
            <ClientManager
                players={players}
                disconnectedPlayers={disconnectedPlayers}
                responses={responses}
                kick={kick}
            />

            <div className="flex gap-4 items-center">
                <button className="btn btn-error btn-outline my-4 flex-grow" onClick={end}>
                    <SquareArrowRightExit />
                    <span>End</span>
                </button>

                <h2 className="text-2xl opacity-60 font-bold">#{code}</h2>
            </div>
        </div>
    );
}
