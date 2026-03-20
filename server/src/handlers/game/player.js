import consola from "consola";

// prettier-ignore
import {
    getGame,
    addPlayer,
    removePlayer,
    getPlayers,
    getPlayer,
    deleteGame,
    createPlayer,
    getAllGameCodes
} from "../../helpers/cache.js";

export default (socket, cache, io) => ({
    async join({ code, username }) {
        const session = await getGame(cache, code);

        if (!session) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        const id = createPlayer(username);

        if (id == -1) {
            socket.emit("error", { message: "Invalid username." });
            return;
        }

        await addPlayer(cache, code, socket.id, { id, username });

        socket.join(code);
        socket.emit("player:joined", { code, id, username });

        const players = await getPlayers(cache, code);

        io.to(session.host).emit("host:players", {
            players: Object.values(players),
        });
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

        // Validate answer
        const question = session.questions[session.index];
        if (!question) {
            socket.emit("error", { message: "Invalid question." });
            return;
        }

        // TODO: Track if user already answered

        // Short answer
        if (question.shortAnswer) {
            socket.emit("message", { text: "NOT AN ERROR! WE GOOD! " + response });
            return;
        }

        // Multiple choice answer
        const picked = question.answers.filter((n) => n.id == (parseInt(response) || -1));
        if (picked.length == 0) {
            socket.emit("error", { message: "Invalid choice" });
            return;
        }

        consola.log(`${picked} for ${picked[0]?.correct}, ${picked[0]?.description}`);
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
