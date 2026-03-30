import { socket } from "../../api/socket";

import { JoinState } from "../../components/game/client/JoinState";
import { Loading } from "../../components/utility/Loading";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function ClientPage() {
  const [state, setState] = useState("DISCONNECTED");
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [username, setUserName] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState({
    id: "0123",
    description: "Loading question...",
    shortAnswer: 1,
    points: 1
  });

  const joinGame = (username, code) => {
    socket.emit("player:join", { code, username });
  };

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setState("CONNECTED");
    };

    const onError = (msg) => {
      console.log(msg);
      if (msg?.soft) {
        toast.error(msg?.message || "Unknown error");
        return;
      }

      setError(msg?.message || "Unknown error");
      setState("ERROR");

      socket.disconnect();
    };

    const onPlayerJoined = (msg) => console.log("joined", msg);
    const onPlayerKicked = (msg) => console.log("kicked", msg);
    const onGameQuestion = (msg) => setCurrentQuestion(msg);
    const onGameEnded = () => console.log("game ended");

    socket.on("connect", onConnect);
    socket.on("error", onError);

    socket.on("player:joined", onPlayerJoined);
    socket.on("player:kicked", onPlayerKicked);
    socket.on("game:question", onGameQuestion);
    socket.on("game:ended", onGameEnded);

    // Cleanup on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("error", onError);

      socket.off("player:joined", onPlayerJoined);
      socket.off("player:kicked", onPlayerKicked);
      socket.off("game:question", onGameQuestion);
      socket.off("game:ended", onGameEnded);

      if (socket.connected) socket.disconnect();
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
    <JoinState joinGame={joinGame} />
  );
}
