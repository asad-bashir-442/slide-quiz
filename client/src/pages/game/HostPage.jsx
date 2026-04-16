import { getAllQuestionsById } from "../../api/editor";
import { socket } from "../../api/socket";

import { LobbyState } from "../../components/game/host/states/LobbyState";
import { ManualState } from "../../components/game/host/states/ManualState";
import { AutomaticState } from "../../components/game/host/states/AutomaticState";
import { Loading } from "../../components/utility/Loading";

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

    const [quiz, setQuiz] = useState({});
    const [automatic, setAutomatic] = useState(false);
    const [players, setPlayers] = useState([]);
    const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);
    const [responses, setResponses] = useState([]);
    const [game, setGame] = useState("");

    const [allQuestions, setAllQuestions] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({
        id: "0123",
        description: "Loading question...",
        shortAnswer: 1,
        points: 1,
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
    };

    const createGame = (automaticGame) => {
        setPlayers([]);
        setDisconnectedPlayers([]);
        setResponses([]);
        setGame({});

        socket.emit("host:create", {
            mode: automaticGame ? "automatic" : "manual",
            quizID: id,
            token,
        });
    };

    const updateMode = () => {
        if (state != "CONNECTED") return;

        const auto = !automatic;

        setState("DISCONNECTED");

        socket.disconnect();
        socket.connect();

        setAutomatic(auto);
        createGame(auto);
    };

    const kick = (playerID, username) => {
        socket.emit("host:kick", { code: game.code, playerID });
        toast.success(`Kicked ${username}`);
    };

    const start = () => {
        if (state != "CONNECTED" || players.length == 0) return;

        socket.emit("host:start", { code: game.code });
        setState("PLAYING");
    };

    const jump = (id) => {
        if (automatic || id == currentQuestion.id) return;

        const index = getQuestionIndex(id);

        if (index == -1) {
            toast.error("Invalid position!");
            return;
        }

        socket.emit("host:jump", { code: game.code, index });
    };

    const jumpNext = () => {
        if (automatic) return;

        const index = getQuestionIndex(currentQuestion.id);

        if (index == -1) {
            toast.error("Invalid position!");
            return;
        }

        socket.emit("host:jump", { code: game.code, index: index + 1 });
    };

    const addAnswer = (answer) => {
        setResponses((prevResponses) => {
            const updated = { ...prevResponses };
            const playerID = answer.player.id;
            const questionID = answer.question.id;

            if (!updated[playerID]) {
                updated[playerID] = [];
            }

            // Check for duplicate
            const alreadyExists = updated[playerID].some((existing) => existing.question.id === questionID);

            if (!alreadyExists) {
                updated[playerID].push({
                    question: answer.question,
                    response: answer.response,
                });
            }

            return updated;
        });
    };

    const addPlayer = (player) => {
        setPlayers((prevPlayers) => {
            const removedPlayers = prevPlayers.filter((prevPlayer) => !player.players.some((newPlayer) => newPlayer.id === prevPlayer.id));

            if (removedPlayers.length > 0) {
                setDisconnectedPlayers((prev) => {
                    const newDisconnected = removedPlayers.filter((removedPlayer) => !prev.some((p) => p.id === removedPlayer.id));
                    return [...prev, ...newDisconnected];
                });
            }

            return player.players;
        });
    };

    const end = () => {
        socket.emit("host:end", { code: game.code });
    };

    const ended = () => {
        socket.disconnect(true);

        setTimeout(() => {
            if (showResults) {
                navigate(`/results/${game.results}`);
                return;
            }

            navigate("/dashboard");
        }, 50);
    };

    const validMCQ = (questions) => {
        for (const q of questions) {
            if (!q.shortAnswer && [undefined, 0].includes(q.answers?.length)) {
                return false;
            }
        }

        return true;
    };

    useEffect(() => {
        document.title = "SlideQuiz | Host";

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

                const isAutomatic = details.data.automatic === 1 || details.data.automatic === true;

                setQuiz(details.data);
                setAutomatic(isAutomatic);

                if (details.data.questions?.length == 0) {
                    setSoftError("Not enough questions to host a game!");
                    return;
                }

                if (!validMCQ(details.data.questions)) {
                    setSoftError("A multiple choice question has no answers!");
                    return;
                }

                createGame(isAutomatic);
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
        const onHostPlayers = (msg) => addPlayer(msg);
        const onHostQuestions = (msg) => setAllQuestions(msg.questions);
        const onHostResponse = (msg) => addAnswer(msg);
        const onGameQuestion = (msg) => setCurrentQuestion(msg);

        socket.on("connect", onConnect);
        socket.on("error", onError);

        socket.on("host:created", onHostCreated);
        socket.on("host:players", onHostPlayers);
        socket.on("host:questions", onHostQuestions);
        socket.on("host:response", onHostResponse);
        socket.on("host:ended", ended);
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
        );
    }

    if (state == "ERROR") {
        return (
            <div className="text-center my-8">
                <h2 className="text-xl text-error opacity-40 my-8 font-bold italic">Error, try reloading the page.</h2>
                <h4 className="text-lg opacity-40 font-bold">Error: {error}</h4>
            </div>
        );
    }

    if (state == "CONNECTED") {
        return (
            <LobbyState
                quiz={quiz}
                game={game}
                players={players}
                softError={softError}
                showResults={showResults}
                automatic={automatic}
                updateMode={updateMode}
                updateResults={updateResults}
                kick={kick}
                start={start}
            />
        );
    }

    return automatic ? (
        <AutomaticState code={game.code} players={players} disconnectedPlayers={disconnectedPlayers} responses={responses} kick={kick} end={end} />
    ) : (
        <ManualState
            code={game.code}
            allQuestions={allQuestions}
            currentQuestion={currentQuestion}
            players={players}
            disconnectedPlayers={disconnectedPlayers}
            responses={responses}
            kick={kick}
            getQuestionIndex={getQuestionIndex}
            end={end}
            jump={jump}
            jumpNext={jumpNext}
        />
    );
}
