import { fadeIn } from "../../../utility/animation";

import { generateUsername } from "unique-username-generator";
import { User, Hash } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export function JoinState({ joinGame, data }) {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState(data || "");
    const [loading, setLoading] = useState(false);

    const random = () =>
        setUsername(
            // NOTE: This includes `-` for some reason, despite the docs saying it won't
            generateUsername("", 3, 15).replace(/-/g, ""),
        );

    const submit = async (e) => {
        e.preventDefault();

        if (username.trim().length == 0 || code.length == 0) {
            setUsername("");
            setCode("");

            return;
        }

        setLoading(true);
        await joinGame(username, code);
        setLoading(false);
    };

    return (
        <motion.div {...fadeIn} className="flex flex-1 flex-col items-center justify-center">
            <div className="max-w-159.5 w-full my-8">
                <h1 className="font-bold text-3xl mb-2">Join Game</h1>
                <form onSubmit={submit} className="bg-base-100 p-6 rounded-2xl">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-base-content/70 text-lg">Game Code</legend>

                        <label className="input validator">
                            <Hash className="text-base-content/70" />

                            <input
                                required
                                minLength="3"
                                maxLength="30"
                                pattern="[A-Za-z0-9]+"
                                autoFocus
                                title="Enter a valid game code"
                                type="text"
                                placeholder="Enter Game Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </label>

                        <p className="validator-hint">Enter a valid game code</p>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-base-content/70 text-lg">Username</legend>
                        <label className="input validator">
                            <User className="text-base-content/70" />

                            <input
                                required
                                minLength="3"
                                maxLength="10"
                                pattern="[A-Za-z0-9]+"
                                title="Enter a valid username"
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>

                        <p className="validator-hint">Enter a valid username</p>
                    </fieldset>

                    <div className="flex">
                        <button type="button" className="btn btn-secondary my-4 btn-sm max-[900px]:w-full max-[900px]:btn-outline" onClick={random} disabled={loading}>
                            Random Username
                        </button>
                    </div>

                    <button className="btn btn-primary w-full max-[900px]:btn-outline" disabled={loading}>
                        Join
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
