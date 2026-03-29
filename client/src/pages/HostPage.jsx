import { getAllQuestionsById } from "../api/editor";
import { socket } from "../api/socket";

import { LobbyState } from "../components/host/states/LobbyState";
import { ManualState } from "../components/host/states/ManualState";
import { Loading } from "../components/utility/Loading";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { SquareArrowRightExit } from "lucide-react";

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

  // return game.automatic ? <h1>hi</h1> : <ManualState />;

  return (
    <div className="mt-10 mb-10 flex gap-4">
      <div className="w-[20%] p-6 rounded-xl bg-base-200 flex flex-col justify-between min-h-[400px]">
        <div>
          {allQuestions.map((question) => (
            <label className="label" key={question.id}>
              <input
                className="radio radio-xl radio-primary"
                type="radio"
                name="radio-questions"
                checked={currentQuestion.id == question.id}
                onClick={() => jump(question.id)}
              />
              <span className="label-text">Question #{getQuestionIndex(question.id) + 1}</span>
            </label>
          ))}
        </div>

        <button className="btn btn-error mt-4" onClick={end}>
          <SquareArrowRightExit />
          <span>End</span>
        </button>
      </div>

      <div className="w-full p-6 rounded-xl bg-base-200">
        <button
          className="btn btn-primary float-right"
          onClick={jumpNext}
          disabled={currentQuestion.id == allQuestions[allQuestions.length - 1]?.id}
        >
          Next Question
        </button>

        <h4>Question {getQuestionIndex(currentQuestion.id) + 1}</h4>
        <h2 className="text-2xl font-bold my-4">{currentQuestion.description}</h2>

        <ol className="list-[upper-alpha] list-inside font-bold">
          {currentQuestion.shortAnswer ? (
            <div className="text-center py-4 bg-base-300 rounded-xl select-none">
              <p className="italic opacity-60 my-4 text-2xl">Short Answer</p>
              <p className="opacity-60 my-4 text-lg">Please type a response.</p>
            </div>
          ) : (
            currentQuestion.answers.map((answer) => (
              <li
                key={answer.id}
                className="p-6 my-6 text-xl bg-base-300 rounded-xl"
              >
                <span className="font-normal">{answer.description}</span>
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
