import { useState } from "react";
import { User, Hash } from "lucide-react";

export function ClientPage() {
  const [code, setCode] = useState("");
  const [username, setUserName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const randomUserInput = document.getElementById("random_username");

    const userData = {
      code,
      username,
      isRandom: randomUserInput.checked,
    };

    console.log(userData);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="max-w-159.5 w-full my-8">
        <h1 className="font-bold text-3xl mb-2">Join Game</h1>
        <form onSubmit={handleSubmit} className=" bg-base-100 p-6 rounded-2xl">
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
                onChange={(e) => setUserName(e.target.value)}
              />
            </label>

            <p className="validator-hint">Enter valid username</p>
          </fieldset>

          <div className="flex gap-2">
            <input
              id="random_username"
              type="checkbox"
              className="toggle mb-6"
            />
            <p className="text-base-content/70">Random Username</p>
          </div>

          <button className="btn btn-primary w-full">Join</button>
        </form>
      </div>
    </div>
  );
}
