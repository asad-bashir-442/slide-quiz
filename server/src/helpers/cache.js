import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const usernameSchema = Joi.string().trim().min(3).max(50).required();
const codelen = parseInt(process.env.CODE_LENGTH) || 4;

export const GAME_PREFIX = "game:";
export const PLAYER_PREFIX = "game:players:";
export const EXPIRE = 86400; // 24 hours

export const createGame = async (cache, hostID, game) => {
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

export const addPlayer = async (cache, code, socketId, playerData) => {
    const key = `${PLAYER_PREFIX}${code}`;

    await cache.hset(key, socketId, JSON.stringify(playerData));
    await cache.expire(key, EXPIRE);
};

export const removePlayer = async (cache, code, socketId) => {
    const key = `${PLAYER_PREFIX}${code}`;
    await cache.hdel(key, socketId);

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
    Object.keys(players).forEach((socketId) => {
        players[socketId] = JSON.parse(players[socketId]);
    });

    return players;
};

export const getPlayer = async (cache, code, socketId) => {
    const key = `${PLAYER_PREFIX}${code}`;
    const data = await cache.hget(key, socketId);

    return data ? JSON.parse(data) : null;
};

export const updatePlayer = async (cache, code, socketId, playerData) => {
    const key = `${PLAYER_PREFIX}${code}`;

    await cache.hset(key, socketId, JSON.stringify(playerData));
    await cache.expire(key, EXPIRE);
};

export const getAllGameCodes = async (cache) => {
    return (await cache.keys(`${GAME_PREFIX}*`)).map((key) => key.replace(GAME_PREFIX, "")).filter((code) => !code.includes(":"));
};

export const createPlayer = (username) => {
    const { error } = usernameSchema.validate(username);
    if (error) return -1;

    return uuidv4();
};
