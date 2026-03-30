import { User, Hash } from "lucide-react";
import { useState } from "react";

export function JoinState({ joinGame }) {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const random = () => {
        setUsername("Bobby");
    };

    const submit = (e) => {
        e.preventDefault();

        setLoading(true);

        console.log(username, code);

        setLoading(false);
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <div className="max-w-159.5 w-full my-8">
                <h1 className="font-bold text-3xl mb-2">Join Game</h1>
                <form onSubmit={submit} className="bg-base-100 p-6 rounded-2xl">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-base-content/70 text-lg">
                            Game Code
                        </legend>

                        <label className="input validator">
                            <Hash className="text-base-content/70" />

                            <input
                                required
                                minLength="5"
                                maxLength="30"
                                autoFocus
                                title="Enter a valid game code"
                                type="text"
                                placeholder="Enter Game Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </label>

                        <p className="validator-hint">Enter valid game code</p>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-base-content/70 text-lg">
                            Username
                        </legend>
                        <label className="input validator">
                            <User className="text-base-content/70" />

                            <input
                                required
                                minLength="5"
                                maxLength="30"
                                title="Enter a valid username"
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>

                        <p className="validator-hint">Enter valid username</p>
                    </fieldset>

                    <div className="flex">
                        <button
                            type="button"
                            className="btn btn-secondary mb-4 btn-sm"
                            onClick={random}
                            disabled={loading}
                        >
                            Random Username
                        </button>
                    </div>

                    <button
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        Join
                    </button>
                </form>
            </div>
        </div>
    );
}

