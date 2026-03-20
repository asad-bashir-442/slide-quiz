import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const usernameSchema = Joi.string().trim().min(3).max(50).required();
const codelen = parseInt(process.env.CODE_LENGTH) || 4;

export const GAME_PREFIX = "game:";
export const PLAYER_PREFIX = "game:players:";
export const RESPONSES_PREFIX = "game:responses:";

export const EXPIRE = 86400; // 24 hours
export const EXPIRE_LONG = 86400 * 7; // 1 week

// Games
export const createGame = async (cache, hostID, game, mode, ownerID) => {
    let id;
    let exists;

    // Generate unique code
    do {
        id = uuidv4().replace(/-/g, "").slice(0, codelen);
        exists = await cache.exists(`${GAME_PREFIX}${id}`);
    } while (exists);

    await cache.set(
        `${GAME_PREFIX}${id}`,

        JSON.stringify({
            host: hostID,
            quiz: game.id,
            name: game.name,
            questions: game.questions,
            index: -1,
            mode,

            // Reduce the likelyhood of collisions, as results will be stored longer
            longCode: uuidv4(),

            // For lookups
            owner: ownerID,
        }),

        "EX",
        EXPIRE,
    );

    await cache.expire(`${PLAYER_PREFIX}${id}`, EXPIRE);
    return id;
};

export const getGame = async (cache, code) => {
    const data = await cache.get(`${GAME_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
};

export const updateGame = async (cache, code, gameData) => {
    await cache.set(`${GAME_PREFIX}${code}`, JSON.stringify(gameData), "EX", EXPIRE);
};

export const deleteGame = async (cache, code) => {
    await cache.del(`${GAME_PREFIX}${code}`);
    await cache.del(`${PLAYER_PREFIX}${code}`);
};

export const getAllGameCodes = async (cache) => {
    // prettier-ignore
    return (await cache.keys(`${GAME_PREFIX}*`))
        .map((key) => key.replace(GAME_PREFIX, ""))
        .filter((code) => !code.includes(":"));
};

// Players
export const addPlayer = async (cache, code, socketID, playerData) => {
    const key = `${PLAYER_PREFIX}${code}`;

    await cache.hset(key, socketID, JSON.stringify(playerData));
    await cache.expire(key, EXPIRE);
};

export const removePlayer = async (cache, code, socketID) => {
    const key = `${PLAYER_PREFIX}${code}`;
    await cache.hdel(key, socketID);

    const remaining = await cache.hlen(key);

    if (remaining === 0) {
        await cache.del(key);
    }
};

export const getPlayers = async (cache, code) => {
    const key = `${PLAYER_PREFIX}${code}`;
    const players = await cache.hgetall(key);

    if (!players || Object.keys(players).length === 0) {
        return {};
    }

    // Parse each player's data
    Object.keys(players).forEach((socketID) => {
        players[socketID] = JSON.parse(players[socketID]);
    });

    return players;
};

export const getPlayer = async (cache, code, socketID) => {
    const key = `${PLAYER_PREFIX}${code}`;
    const data = await cache.hget(key, socketID);

    return data ? JSON.parse(data) : null;
};

export const updatePlayer = async (cache, code, socketID, playerData) => {
    const key = `${PLAYER_PREFIX}${code}`;

    await cache.hset(key, socketID, JSON.stringify(playerData));
    await cache.expire(key, EXPIRE);
};

export const createPlayer = (username) => {
    const { error } = usernameSchema.validate(username);
    if (error) return -1;

    return uuidv4();
};

// Responses
export const createResponse = async (cache, owner, longCode, socketID, playerDetails, response, questionIndex) => {
    const key = `${RESPONSES_PREFIX}${owner}:${longCode}:${questionIndex}`;

    await cache.hset(key, socketID, JSON.stringify({ player: playerDetails, response }));
    await cache.expire(key, EXPIRE_LONG);
};

export const createResponseSession = async (cache, owner, longCode, name, questions, mode) => {
    const key = `${RESPONSES_PREFIX}${owner}:${longCode}`;

    await cache.set(key, JSON.stringify({ name, questions, mode }));
    await cache.expire(key, EXPIRE_LONG);
};

export const hasResponse = async (cache, owner, longCode, socketID, questionIndex) => {
    return await cache.hexists(`${RESPONSES_PREFIX}${owner}:${longCode}:${questionIndex}`, socketID);
};
