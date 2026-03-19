import { createGame, getGame, updateGame, getPlayers, updatePlayers } from "../../helpers/cache.js";

export default (socket, cache, io) => ({
    async manual({ quizID }) {
        const id = await createGame(cache, socket.id, quizID);

        if (id == -1) {
            socket.emit("error", { message: "Invalid quiz ID." });
            return;
        }

        // Join the created game
        socket.join(id);
        socket.emit("host:created", { code: id });
    },

    async start({ code }) {
        const session = await getGame(cache, code);

        if (!session || session.host != socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        // Update game state
        session.index = 0;
        await updateGame(cache, code, session);

        // Set question to start
        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "No question to start with." });
            return;
        }

        socket.emit("host:questions", { questions: session.questions });
        io.to(code).emit("game:question", question);
    },

    async jump({ code, index }) {
        const session = await getGame(cache, code);

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
        await updateGame(cache, code, session);

        // Emit to players
        const question = session.questions[session.index];

        if (!question) {
            socket.emit("error", { message: "Invalid question." });
            return;
        }

        io.to(code).emit("game:question", question);
    },

    async kick({ code, playerID }) {
        const session = await getGame(cache, code);

        if (!session || session.host !== socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        const players = await getPlayers(cache, code);

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
            await updatePlayers(cache, code, players);

            io.to(target).emit("player:kicked", { message: "You were kicked from the game." });
            io.to(session.host).emit("host:players", { players: Object.values(players) });

            // TODO: Disconnect the player?
        } else {
            socket.emit("error", { message: "Player not found." });
        }
    },
});
