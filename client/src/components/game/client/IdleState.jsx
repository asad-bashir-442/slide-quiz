import { SquareArrowRightExit } from "lucide-react";
import { Loading } from "../../utility/Loading";

export function IdleState({ username, code, leaveGame }) {
    return (
        <div className="text-center my-8">
            <h2 className="text-4xl opacity-40 my-8 font-bold">
                Welcome {username}
            </h2>

            <h2 className="text-xl opacity-40 font-bold italic">
                <Loading />
                <span className="ml-4">Waiting for the host to start...</span>
            </h2>

            <button
                className="btn btn-error my-8"
                onClick={leaveGame}
            >
                <SquareArrowRightExit />
                Leave
            </button>
        </div>
    );
}
