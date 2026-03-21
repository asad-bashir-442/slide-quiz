import Joi from "joi";

// prettier-ignore
import {
    getGame,
    addPlayer,
    removePlayer,
    getPlayers,
    getPlayer,
    deleteGame,
    createPlayer,
    getAllGameCodes,
    updatePlayer,
    createResponse,
    hasResponse
} from "../../helpers/cache.js";

const shortAnswerSchema = Joi.string().trim().min(3).max(1000).required();
const choiceAnswerSchema = Joi.string().uuid().required();

export default (socket, cache, io) => ({
    async join({ code, username }) {
        const session = await getGame(cache, code);

        if (!session) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        // Validate player
        const id = createPlayer(username);

        if (id == -1) {
            socket.emit("error", { message: "Invalid username." });
            return;
        }

        // Create player
        const player = { id, username };

        if (session.mode == "automatic") {
            player.index = 0;
        }

        await addPlayer(cache, code, socket.id, player);

        socket.join(code);
        socket.emit("player:joined", { code, player: player });

        // Update player list
        const players = await getPlayers(cache, code);

        io.to(session.host).emit("host:players", {
            players: Object.values(players),
        });

        // If the game is already running, the player should recieve the current question
        if (session.index != -1 && !isNaN(session.index)) {
            socket.emit("game:question", session.questions[session.mode == "manual" ? session.index : player.index]);
        }
    },

    async answer({ code, response }) {
        const session = await getGame(cache, code);

        if (!session) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        // Check if player is in the game
        const player = await getPlayer(cache, code, socket.id);

        if (!player) {
            socket.emit("error", { message: "You have not joined that lobby." });
            return;
        }

        if (session.index == -1) {
            socket.emit("error", { message: "Game has not started." });
            return;
        }

        // Validate index
        const index = session.mode == "manual" ? session.index : player.index;

        if (isNaN(index)) {
            socket.emit("error", { message: "Invalid index." });
            return;
        }

        // Get question
        const question = session.questions[index];

        if (!question) {
            socket.emit("error", { message: "Invalid question." });
            return;
        }

        // Has the user already responded (impossible in automatic mode)
        if (await hasResponse(cache, session.owner, session.longCode, socket.id, index)) {
            socket.emit("error", { message: "You have already responded to that question" });
            return;
        }

        const { error } = (
            question.shortAnswer ? shortAnswerSchema : choiceAnswerSchema
        ).validate(response);

        if (error) {
            socket.emit("error", { message: "Invalid response." });
            return;
        }

        // Parse answer
        let answer, correct;

        if (question.shortAnswer) {
            answer = response;
        } else {
            // No valid answers
            if (question.answers.length == 0) {
                answer = "No valid choices! Please check the quiz editor!";
            } else {
                const picked = question.answers.filter((n) => n.id == response);

                if (picked.length == 0) {
                    socket.emit("error", { message: "Invalid choice" });
                    return;
                }

                answer = picked[0].description;
                correct = picked[0].correct;
            }
        }

        const playerDetails = {
            id: player.id,
            username: player.username
        };

        const responseDetails = {
            answer, correct,
            timestamp: Date.now(),
        };

        // Save and emit to host
        await createResponse(
            cache,
            session.owner,
            session.longCode,
            socket.id,
            playerDetails,
            responseDetails,
            index,
        );

        io.to(session.host).emit("host:response", {
            player: playerDetails,
            response: responseDetails,
            question,
        });

        // No need to update any indexes if we're on manual
        if (session.mode == "manual") return;

        // If automatic, make sure the index does not update if we're at the end
        if (player.index + 1 < session.questions.length) {
            player.index++;

            await updatePlayer(cache, code, socket.id, player);
            socket.emit("game:question", session.questions[player.index]);

            return;
        }

        // Reached end of an automatic game, disconnect
        socket.emit("game:ended");
    },

    async disconnect() {
        const gameCodes = await getAllGameCodes(cache);

        // Check if socket is a host
        for (const code of gameCodes) {
            const session = await getGame(cache, code);

            if (session?.host === socket.id) {
                io.to(code).emit("game:ended");
                await deleteGame(cache, code);

                return;
            }
        }

        // Check if socket is a player
        for (const code of gameCodes) {
            const player = await getPlayer(cache, code, socket.id);

            if (player) {
                await removePlayer(cache, code, socket.id);
                const session = await getGame(cache, code);

                if (session) {
                    const players = await getPlayers(cache, code);

                    io.to(session.host).emit("host:players", {
                        players: Object.values(players),
                    });
                }

                return;
            }
        }
    },
});
