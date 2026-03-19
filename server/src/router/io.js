import router from "./router.js";

// const expire = 86400;
const expire = 60 * 10; // TODO: Debugging ONLY

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

const GAME_PREFIX = "game:";
const PLAYER_PREFIX = "players:";

const createGame = async (cache, hostID, quizID) => {
    let id;
    let exists;

    // Generate unique code
    do {
        id = Math.floor(100000 + Math.random() * 900000).toString();
        exists = await cache.exists(`${GAME_PREFIX}${id}`);
    } while (exists);

    // TODO: Fetch from the database
    const game = quizDB[quizID];

    if (!game) {
        return -1;
    }

    // Set game
    await cache.set(
        `${GAME_PREFIX}${id}`,
        JSON.stringify({
            host: hostID,
            quiz: quizID,
            name: game.name,
            questions: game.questions,
            index: -1,
        }),

        "EX",
        expire,
    );

    await cache.set(
        `${PLAYER_PREFIX}${id}`,
        JSON.stringify({}),

        "EX",
        expire,
    );

    return id;
};

const getGame = async (cache, code) => {
    const data = await cache.get(`${GAME_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
};

const updateGame = async (cache, code, gameData) => {
    await cache.set(`${GAME_PREFIX}${code}`, JSON.stringify(gameData), "EX", expire);
};

const getPlayers = async (cache, code) => {
    const data = await cache.get(`${PLAYER_PREFIX}${code}`);
    return data ? JSON.parse(data) : {};
};

const updatePlayers = async (cache, code, players) => {
    await cache.set(`${PLAYER_PREFIX}${code}`, JSON.stringify(players), "EX", expire);
};

const deleteGame = async (cache, code) => {
    await cache.del(`${GAME_PREFIX}${code}`);
    await cache.del(`${PLAYER_PREFIX}${code}`);
};

const createPlayer = (username) => {
    // TODO: Validate username
    // JOI
    if (username == "") {
        return -1;
    }

    // TODO: UUID?
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.io.on("connection", (socket) => {
    // Hosting
    socket.on("host:manual", async ({ quizID }) => {
        const id = await createGame(router.redis, socket.id, quizID);

        if (id == -1) {
            socket.emit("error", { message: "Invalid quiz ID." });
            return;
        }

        // Join the created game
        socket.join(id);
        socket.emit("host:created", { code: id });
    });

    socket.on("host:start", async ({ code }) => {
        const session = await getGame(router.redis, code);

        if (!session || session.host != socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        // Update game state
        session.index = 0;
        await updateGame(router.redis, code, session);

        // Set question to start
        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "No question to start with." });
            return;
        }

        socket.emit("host:questions", { questions: session.questions });
        router.io.to(code).emit("game:question", question);
    });

    socket.on("host:jump", async ({ code, index }) => {
        const session = await getGame(router.redis, code);

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

        // Update game state
        session.index = index;
        await updateGame(router.redis, code, session);

        // Emit to players
        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "Invalid question." });
            return;
        }

        router.io.to(code).emit("game:question", question);
    });

    socket.on("host:kick", async ({ code, playerID }) => {
        const session = await getGame(router.redis, code);

        if (!session || session.host !== socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        const players = await getPlayers(router.redis, code);

        // No players, don't do anything
        if (!players) return;

        let target = null;
        let kick = null;

        // Find player
        for (const [socketID, player] of Object.entries(players)) {
            if (player.id === playerID) {
                target = socketID;
                kick = player;

                break;
            }
        }

        // Player was found, kick
        if (target && kick) {
            delete players[target];
            await updatePlayers(router.redis, code, players);

            router.io.to(target).emit("player:kicked", { message: "You were kicked from the game." });
            router.io.to(session.host).emit("host:players", { players: Object.values(players) });

            // TODO: Disconnect the player?
        } else {
            socket.emit("error", { message: "Player not found." });
        }
    });

    // Players
    socket.on("player:join", async ({ code, username }) => {
        const session = await getGame(router.redis, code);

        if (!session) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        const players = await getPlayers(router.redis, code);
        const id = createPlayer(username);

        if (id == -1) {
            socket.emit("error", { message: "Invalid user." });
            return;
        }

        players[socket.id] = {
            id,
            username,
            score: 0, // TODO:
        };

        await updatePlayers(router.redis, code, players);

        // Emit to host
        socket.join(code);
        socket.emit("player:joined", { code, id, username });

        router.io.to(session.host).emit("host:players", {
            players: Object.values(players),
        });
    });

    // TODO: This
    socket.on("player:answer", async () => {});

    socket.on("disconnect", async () => {
        // Host disconnect
        const gameKeys = await router.redis.keys(`${GAME_PREFIX}*`);

        for (const key of gameKeys) {
            const code = key.replace(GAME_PREFIX, "");
            const session = await getGame(router.redis, code);

            if (session && session.host === socket.id) {
                router.io.to(code).emit("game:ended");
                await deleteGame(router.redis, code);

                break;
            }
        }

        // Player disconnect
        const allPlayers = await router.redis.keys(`${PLAYER_PREFIX}*`);

        for (const key of allPlayers) {
            const code = key.replace(PLAYER_PREFIX, "");
            const players = await getPlayers(router.redis, code);

            if (players[socket.id]) {
                delete players[socket.id];
                await updatePlayers(router.redis, code, players);

                const session = await getGame(router.redis, code);

                if (session) {
                    router.io.to(session.host).emit("host:players", {
                        players: Object.values(players),
                    });
                }

                break;
            }
        }
    });
});
