import { SquareArrowRightExit } from "lucide-react";
import { Loading } from "../../utility/Loading";

export function IdleState({ username, code, leaveGame }) {
    return (
        <div className="text-center my-8">
            <h2 className="text-4xl opacity-40 my-8 font-bold max-[900px]:text-lg">Welcome {username}</h2>

            <h2 className="text-xl opacity-40 font-bold italic max-[900px]:text-sm">
                <Loading />
                <span className="ml-4 max-[900px]:block max-[900px]:mt-4">Waiting for the host to start...</span>
            </h2>

            <button className="btn btn-error my-8 max-[900px]:w-[90%] max-[900px]:btn-outline" onClick={leaveGame}>
                <SquareArrowRightExit />
                Leave
            </button>
        </div>
    );
}
