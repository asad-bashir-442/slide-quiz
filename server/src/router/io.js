import consola from "consola";
import router from "./router.js";

const quizDB = [
    {
        name: "Countries of the world",
        description: "A quiz",
        questions: [
            {
                q: "What is the capital of Canada",
                a: ["Ottawa", "Toronto", "New York"],
            },

            {
                // No a = short answer
                q: "How old is Canada?",
            },
        ],
    },
];

const gamesDB = new Map();
const playersDB = new Map();

const createGame = (hostID, quizID) => {
    const id = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Fetch from the database
    const game = quizDB[quizID];

    if (!game) {
        return -1;
    }

    // TODO: Actually create the game in redis + duplicate checking
    gamesDB.set(id, {
        host: hostID,
        quiz: quizID,

        name: game.name,
        questions: game.questions,
        index: -1,
    });

    // TODO: Likely unneeded for redis
    playersDB.set(id, new Map());
    consola.info(`[io] Creating game (${id}) with quiz #${quizID}`);

    return id;
};

const createPlayer = (username) => {
    // TODO: Validate username
    // JOI
    if (username == "") {
        return -1;
    }

    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Host can:
//   -> Create manual game
//   <- Get ID of created game
//
//   -> Start the game
//
//   -> Set the current question index for players
//
//   -> End the game
//   <- Game ended
//
//   -> Kick a player
//   <- Kicked (?)

// Player can:
//   -> Join a game
//   <- Joined
//
//   <- Kicked

router.io.on("connection", (socket) => {
    socket.on("host:manual", async ({ quizID }) => {
        const id = createGame(socket.id, quizID);

        if (id == -1) {
            socket.emit("error", { message: "Invalid quiz ID." });
            return;
        }

        // Join the created game
        socket.join(id);
        socket.emit("host:created", { code: id });
    });

    socket.on("host:start", async ({ code }) => {
        const session = gamesDB.get(code);

        if (!session || session.host != socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        session.index = 0;
        gamesDB.set(code, session);

        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "No question to start with." });
            return;
        }

        socket.emit("host:questions", { questions: session.questions });
        router.io.to(code).emit("game:question", question);
    });

    socket.on("host:jump", async ({ code, index }) => {
        const session = gamesDB.get(code);

        if (!session || session.host != socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        if (session.index == -1) {
            socket.emit("error", { message: "Game has not started yet." });
            return;
        }

        // TODO: JOI number validate
        if (index < 0 || index > session.questions.length) {
            socket.emit("error", { message: "Invalid index." });
            return;
        }

        session.index = index;
        gamesDB.set(code, session);

        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "Invalid question." });
            return;
        }

        router.io.to(code).emit("game:question", question);
    });

    socket.on("host:kick", async ({ code, playerID }) => {
        const session = gamesDB.get(code);

        if (!session || session.host !== socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        const players = playersDB.get(code);

        // No players, don't do anything
        if (!players) return;

        let target = null;
        let kick = null;

        for (const [socketID, player] of players.entries()) {
            if (player.id === playerID) {
                target = socketID;
                kick = player;

                break;
            }
        }

        if (target && kick) {
            players.delete(target);

            router.io.to(target).emit("player:kicked", { message: "You were kicked from the game." });
            router.io.to(session.host).emit("host:players", { players: Array.from(players.values()) });

            // TODO: Disconnect the player?
        } else {
            socket.emit("error", { message: "Player not found." });
        }
    });

    // Players
    socket.on("player:join", async ({ code, username }) => {
        if (!gamesDB.has(code)) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        const players = playersDB.get(code);
        const id = createPlayer(username);

        // TODO: Should we check duplicates? Maybe not, what if someone rejoins
        if (id == -1) {
            socket.emit("error", { message: "Invalid user." });
            return;
        }

        players.set(socket.id, {
            id,
            username,
            score: 0, // TODO:
        });

        socket.join(code);
        socket.emit("player:joined", { code, id, username });

        router.io.to(gamesDB.get(code).host).emit("host:players", {
            players: Array.from(players.values()),
        });
    });

    // TODO: This
    socket.on("player:answer", async () => {});

    socket.on("disconnect", async () => {
        // Host disconnect
        for (const [code, game] of gamesDB.entries()) {
            if (game.host === socket.id) {
                router.io.to(code).emit("game:ended");

                gamesDB.delete(code);
                playersDB.delete(code);

                break;
            }
        }

        // Player disconnect
        for (const [code, players] of playersDB.entries()) {
            if (players.has(socket.id)) {
                const game = gamesDB.get(code);

                console.log(code);
                players.delete(socket.id);

                if (game) {
                    router.io.to(game.host).emit("host:players", {
                        players: Array.from(players.values()),
                    });
                }

                break;
            }
        }
    });
});
