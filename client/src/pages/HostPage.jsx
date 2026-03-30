import { getAllQuestionsById } from "../api/editor";
import { socket } from "../api/socket";

import { LobbyState } from "../components/host/states/LobbyState";
import { ManualState } from "../components/host/states/ManualState";
import { Loading } from "../components/utility/Loading";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function HostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [state, setState] = useState("DISCONNECTED");
  const [error, setError] = useState("");
  const [softError, setSoftError] = useState("");

  const [quiz, setQuiz] = useState({ automatic: false });
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState("");

  const [allQuestions, setAllQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: "0123",
    description: "Loading question...",
    shortAnswer: 1,
    points: 1
  });

  const updateResults = () => {
    setShowResults(!showResults);
  };

  const getQuestionIndex = (id) => {
    for (let i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].id == id) {
        return i;
      }
    }

    return -1;
  }

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

  const start = () => {
    // TODO: Uncomment this
    // if (state != "CONNECTED" || players.length == 0) return;

    socket.emit("host:start", { code: game.code });
    setState("PLAYING");
  };

  const jump = (id) => {
    if (quiz.automatic || id == currentQuestion.id) return;

    const index = getQuestionIndex(id);

    if (index == -1) {
      toast.error("Invalid position!");
      return;
    }

    socket.emit("host:jump", { code: game.code, index });
  };

  const jumpNext = () => {
    if (quiz.automatic) return;

    const index = getQuestionIndex(currentQuestion.id);

    if (index == -1) {
      toast.error("Invalid position!");
      return;
    }

    socket.emit("host:jump", { code: game.code, index: index + 1 });
  };

  // TODO: Maybe confirm alert?
  // NOTE: This needs to be confirmed
  const end = () => {
    if (showResults) {
      socket.disconnect();
      navigate(`/results/${game.results}`);

      return;
    }

    navigate("/results");
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
    const onHostQuestions = (msg) => setAllQuestions(msg.questions);
    const onHostResponse = (msg) => console.log("got response -> ", msg);
    const onGameQuestion = (msg) => setCurrentQuestion(msg);

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

  // TODO: This should be last
  if (state == "CONNECTED") {
    return (
      <LobbyState
        quiz={quiz}
        game={game}
        players={players}
        softError={softError}
        showResults={showResults}
        updateMode={updateMode}
        updateResults={updateResults}
        kick={kick}
        start={start}
      />
    )
  }

  return game.automatic ? <h1>hi</h1> : (
    <ManualState
      allQuestions={allQuestions}
      currentQuestion={currentQuestion}
      getQuestionIndex={getQuestionIndex}
      end={end}
      jump={jump}
      jumpNext={jumpNext}
    />
  );
}
