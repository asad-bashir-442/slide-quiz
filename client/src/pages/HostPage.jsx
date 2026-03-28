import { socket } from "../api/socket";

import { Loading } from "../components/utility/Loading";

import { useState, useEffect } from "react";
import { useParams } from "react-router";

export function HostPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [state, setState] = useState("DISCONNECTED");
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState({});

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

    const onHostCreated = (msg) => {
      console.log("created game -> ", msg);
    };

    const onHostPlayers = (msg) => {
      console.log("player list -> ", msg);
    };

    const onHostQuestions = (msg) => {
      console.log("all questions -> ", msg);
    };

    const onHostResponse = (msg) => {
      console.log("got response -> ", msg);
    };

    const onGameQuestion = (msg) => {
      console.log("current question -> ", msg);
    };

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

  const clicked = () => {
    socket.emit("host:create", { gameId: "test" });
  }

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
      <button onClick={clicked}>hi</button>
    </>
  );
}
