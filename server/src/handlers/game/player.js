import { GAME_PREFIX, PLAYER_PREFIX, getGame, getPlayers, updatePlayers, deleteGame, createPlayer } from "../../helpers/cache.js";

import consola from "consola";

export default (socket, cache, io) => ({
    async join({ code, username }) {
        const session = await getGame(cache, code);

        if (!session) {
            socket.emit("error", { message: "Game not found." });
            return;
        }

        const players = await getPlayers(cache, code);
        const id = createPlayer(username);

        if (id == -1) {
            socket.emit("error", { message: "Invalid user." });
            return;
        }

        players[socket.id] = { id, username };
        await updatePlayers(cache, code, players);

        // Emit to host
        socket.join(code);
        socket.emit("player:joined", { code, id, username });

        io.to(session.host).emit("host:players", {
            players: Object.values(players),
        });
    },

    async answer({ code, response }) {
        const session = await getGame(cache, code);
        const players = await getPlayers(cache, code);

        // Validate answer state
        if (!players[socket.id]) {
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

        // TODO: Has the user already entered a response?

        // Short answer
        if (question.shortAnswer) {
            socket.emit("error", { message: "NOT AN ERROR! WE GOOD! " + response });

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
        // Host disconnect
        const gameKeys = await cache.keys(`${GAME_PREFIX}*`);

        for (const key of gameKeys) {
            const code = key.replace(GAME_PREFIX, "");
            const session = await getGame(cache, code);

            if (session && session.host === socket.id) {
                io.to(code).emit("game:ended");
                await deleteGame(cache, code);

                break;
            }
        }

        // Player disconnect
        const allPlayers = await cache.keys(`${PLAYER_PREFIX}*`);

        for (const key of allPlayers) {
            const code = key.replace(PLAYER_PREFIX, "");
            const players = await getPlayers(cache, code);

            if (players[socket.id]) {
                delete players[socket.id];
                await updatePlayers(cache, code, players);

                const session = await getGame(cache, code);

                if (session) {
                    io.to(session.host).emit("host:players", {
                        players: Object.values(players),
                    });
                }

                break;
            }
        }
    },
});
