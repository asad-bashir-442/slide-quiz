import Joi from "joi";
import consola from "consola";

// prettier-ignore
import {
    createGame,
    getGame,
    updateGame,
    getPlayers,
    removePlayer,
    createResponseSession,
    deleteGame
} from "../../helpers/cache.js";
import { queryQuestions } from "../../helpers/database.js";

const jumpSchema = Joi.number().min(0).max(999).integer().required();

export default (socket, cache, db, jwt, io) => ({
    async create({ mode, token, quizID }) {
        if (!["automatic", "manual"].includes(mode)) {
            socket.emit("error", { message: "Invalid mode." });
            return;
        }

        try {
            const verify = await jwt.verify(token);
            const game = await queryQuestions(db, verify.id, quizID);

            if (game == -1 || game == 404) {
                socket.emit("error", { message: "Invalid quiz ID." });
                return;
            }

            const { code, longCode } = await createGame(cache, socket.id, game, mode, verify.id);

            // Join the created game
            socket.join(code);
            socket.emit("host:created", { code, mode, results: longCode });
        } catch (err) {
            consola.error(`[host] Failed to create host lobby - ${err}`);
            socket.emit("error", { message: "Invalid token." });
        }
    },

    async start({ code }) {
        const session = await getGame(cache, code);

        if (!session || session.host != socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        if (session.index != -1) {
            socket.emit("error", { message: "Game has already started." });
            return;
        }

        // Update game state
        session.index = 0;

        await updateGame(cache, code, session);
        await createResponseSession(
            cache,
            session.owner,
            session.longCode,

            session.name,
            session.questions,
            session.mode,
        );

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

        if (session.mode != "manual") {
            socket.emit("error", { message: "Cannot jump in an automatic game." });
            return;
        }

        const { error } = jumpSchema.validate(index);

        if (error || index < 0 || index > session.questions.length) {
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

    async jumper({ code, token, index }) {
        try {
            const verify = await jwt.verify(token);
            const session = await getGame(cache, code);

            if (!session || session.owner != verify.id) {
                socket.emit("error", { message: "Invalid game." });
                return;
            }

            if (session.index == -1) {
                socket.emit("error", { message: "Game has not started yet." });
                return;
            }

            if (session.mode != "manual") {
                socket.emit("error", { message: "Cannot jump in an automatic game." });
                return;
            }

            // Find index of question
            let qIndex = -1;

            for (let i = 0; i < session.questions.length; i++) {
                if (session.questions[i].jumper == index) {
                    qIndex = i;
                    break;
                }
            }

            if (qIndex == -1) {
                socket.emit("error", { message: "Invalid jump location" });
                return;
            }

            // Update index and emit
            session.index = qIndex;
            await updateGame(cache, code, session);

            // Emit to players
            const question = session.questions[session.index];

            if (!question) {
                socket.emit("error", { message: "Invalid question." });
                return;
            }

            io.to(code).emit("game:question", question);
        } catch (err) {
            consola.error(`[host] Failed to jump to an index - ${err}`);
            socket.emit("error", { message: "Invalid jump." });
        }
    },

    async kick({ code, playerID }) {
        const session = await getGame(cache, code);

        if (!session || session.host !== socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        const players = await getPlayers(cache, code);

        // Find player socket ID by player ID
        let target = null;
        let kicked = null;

        for (const [sid, player] of Object.entries(players)) {
            if (player.id === playerID) {
                target = sid;
                kicked = player;
                break;
            }
        }

        // Player was found, kick
        if (target && kicked) {
            await removePlayer(cache, code, target);

            io.to(target).emit("player:kicked", {
                message: "You were kicked from the game.",
            });

            const kickedSocket = io.sockets.sockets.get(target);
            if (kickedSocket) kickedSocket.leave(code);

            // Update player list
            const updatedPlayers = await getPlayers(cache, code);

            io.to(session.host).emit("host:players", {
                players: Object.values(updatedPlayers),
            });
        } else {
            socket.emit("error", { message: "Player not found." });
        }
    },

    async end({ code }) {
        const session = await getGame(cache, code);

        if (!session || session.host !== socket.id) {
            socket.emit("error", { message: "Invalid game." });
            return;
        }

        io.to(code).emit("game:ended");

        await deleteGame(cache, code);

        // Once the game has properly been ended, disconnect the host
        socket.emit("host:ended", { code });
    },
});
