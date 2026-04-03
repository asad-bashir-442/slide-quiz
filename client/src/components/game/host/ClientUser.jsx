import { comma } from "../../../utility/numbers";
import { truncateText } from "../../../utility/truncate";

import { User } from "lucide-react";

export function ClientUser({ text, players, setMain }) {
    return (
        <div>
            <h2>
                <span className="font-bold">{text} Players: </span>
                <span className={players.length == 0 ? "text-error" : "text-success"}>
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
    );
}
