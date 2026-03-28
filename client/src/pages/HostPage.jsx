import { getAllQuestionsById } from "../api/editor";
import { socket } from "../api/socket";

import { truncateText } from "../utility/truncate";
import { comma } from "../utility/numbers";

import { Loading } from "../components/utility/Loading";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Copy, User } from "lucide-react";
import { toast } from "sonner";

export function HostPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [state, setState] = useState("DISCONNECTED");
  const [error, setError] = useState("");
  const [softError, setSoftError] = useState("");

  const [quiz, setQuiz] = useState({ automatic: false });
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState("");

  const createGame = () => {
    setPlayers([]);
    setGame({});

    socket.emit("host:create", {
      mode: quiz.automatic ? "automatic" : "manual",
      quizID: id,
      token,
    });
  };

  const updateMode = () => {
    if (state != "CONNECTED") return;

    setQuiz({ ...quiz, automatic: !quiz.automatic });
    createGame();
  };

  const kick = (playerID, username) => {
    socket.emit("host:kick", { code: game.code, playerID });
    toast.success(`Kicked ${username}`)
  };

  const copy = () => {
    navigator.clipboard.writeText(game.code);
    toast.success(`Copied "${game.code}"`);
  };

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("Invalid ID");
        setState("ERROR");

        return;
      }

      try {
        const details = await getAllQuestionsById(id);

        if (details?.statusCode != 200 || !details?.data) {
          throw new Error("Quiz not found");
        }

        setQuiz(details.data);

        if (details.data.questions?.length == 0) {
          setSoftError("Not enough questions to host a game!");
          return;
        }

        createGame();
      } catch (err) {
        console.error(err);

        setError(`Failed to fetch quiz details - is "${id}" correct?`);
        setState("ERROR");
      }
    })();
  }, [id]);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setState("CONNECTED");
    };

    const onError = (msg) => {
      setError(msg?.message || "Unknown error");
      setState("ERROR");

      socket.disconnect();
    };

    const onHostCreated = (msg) => setGame(msg);
    const onHostPlayers = (msg) => setPlayers(msg.players);

    const onHostQuestions = (msg) => console.log("all questions -> ", msg);
    const onHostResponse = (msg) => console.log("got response -> ", msg);
    const onGameQuestion = (msg) => console.log("current question -> ", msg);

    socket.on("connect", onConnect);
    socket.on("error", onError);

    socket.on("host:created", onHostCreated);
    socket.on("host:players", onHostPlayers);
    socket.on("host:questions", onHostQuestions);
    socket.on("host:response", onHostResponse);
    socket.on("game:question", onGameQuestion);

    // Cleanup on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("error", onError);

      socket.off("host:created", onHostCreated);
      socket.off("host:players", onHostPlayers);
      socket.off("host:questions", onHostQuestions);
      socket.off("host:response", onHostResponse);
      socket.off("game:question", onGameQuestion);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // State processing
  if (state == "DISCONNECTED") {
    return (
      <div className="text-center my-8">
        <h2 className="text-xl opacity-40 my-8 font-bold italic">Disconnected, reconnecting...</h2>
        <Loading />
      </div>
    )
  }

  if (state == "ERROR") {
    return (
      <div className="text-center my-8">
        <h2 className="text-xl text-error opacity-40 my-8 font-bold italic">Error, try reloading the page.</h2>
        <h4 className="text-lg opacity-40 font-bold">Error: {error}</h4>
      </div>
    )
  }

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
                <div className="stat-title font-bold opacity-60">Total Players</div>
                <div className="stat-value">{comma(players.length)}</div>
              </div>

              <div className="stat rounded-xl shadow bg-base-300 max-w-[125px] max-[900px]:hidden">
                <div className="stat-title font-bold opacity-60">Total Questions</div>
                <div className="stat-value">{comma(quiz?.questions?.length || 0)}</div>
              </div>

              <div className="max-w-[60%] max-[900px]:max-w-full max-[900px]:flex-row text-left">
                <div className="my-4">
                  <input
                    type="checkbox"
                    value="light"
                    className="toggle toggle-primary"
                    checked={quiz?.automatic}
                    onChange={updateMode}
                  />

                  <span className="ml-4">Automatic Mode?</span>
                </div>

                <div className="my-4">
                  <input
                    type="checkbox"
                    value="light"
                    className="toggle toggle-primary"
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
              <h1 className="opacity-60 font-bold text-2xl my-8 select-none">No players yet...</h1>
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
