import { socket } from "../../api/socket";

import { JoinState } from "../../components/game/client/JoinState";
import { IdleState } from "../../components/game/client/IdleState";
import { RespondState } from "../../components/game/client/RespondState";
import { Loading } from "../../components/utility/Loading";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const placeholder = {
  id: "0123",
  description: "Loading question...",
  shortAnswer: 1,
  points: 1
}

export function ClientPage() {
  const [state, setState] = useState("DISCONNECTED");

  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(placeholder);
  const [responses, setResponses] = useState([]);

  const joinGame = (username, code) => {
    socket.emit("player:join", { code, username });
  };

  const leaveGame = () => {
    socket.disconnect();

    setCode("");
    setUsername("");
    setCurrentQuestion(placeholder);
    setResponses([]);
    setState("DISCONNECTED");

    socket.connect();
  }

  const respond = (response) => {
    if (state != "RESPONDING") return;

    socket.emit("player:answer", { code, response });
    setResponses([...responses, currentQuestion.id]);
  };

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setState("CONNECTED");
    };

    const onError = (msg) => {
      toast.error(msg?.message || "Unknown error");
    };

    const onPlayerJoined = (msg) => {
      if (msg?.code && msg?.player) {
        setCode(msg.code);
        setUsername(msg.player.username);
        setState("IDLE");
      }
    };

    const onPlayerKicked = (msg) => {
      toast.error(msg?.message || "You've been kicked!");
      leaveGame();
    };

    const onGameQuestion = (msg) => {
      setCurrentQuestion(msg);
      setState("RESPONDING");
    };

    const onGameEnded = () => {
      toast.success("Game has ended! Thank you for playing.");
      leaveGame();
    };

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
        <h2 className="text-xl opacity-40 my-8 font-bold italic">Disconnected, connecting...</h2>
        <Loading />
      </div>
    );
  }

  if (state == "IDLE") {
    return (
      <IdleState
        username={username}
        code={code}
        leaveGame={leaveGame}
      />
    );
  }

  if (state == "RESPONDING") {
    return (
      <RespondState
        currentQuestion={currentQuestion}
        responses={responses}
        code={code}
        respond={respond}
      />
    );
  }

  return (
    <JoinState joinGame={joinGame} />
  );
}
