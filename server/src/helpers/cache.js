import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const usernameSchema = Joi.string().trim().min(3).max(50).required();
const codelen = parseInt(process.env.CODE_LENGTH) || 4;

export const GAME_PREFIX = "game:";
export const PLAYER_PREFIX = "players:";
export const EXPIRE = 86400; // 24 hours

export const createGame = async (cache, hostID, game) => {
    let id;
    let exists;

    // Generate unique code
    do {
        id = uuidv4().replace(/-/g, "").slice(0, codelen);
        exists = await cache.exists(`${GAME_PREFIX}${id}`);
    } while (exists);

    // Set game
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

    await cache.set(
        `${PLAYER_PREFIX}${id}`,
        JSON.stringify({}),

        "EX",
        EXPIRE,
    );

    return id;
};

export const getGame = async (cache, code) => {
    const data = await cache.get(`${GAME_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
};

export const updateGame = async (cache, code, gameData) => {
    await cache.set(`${GAME_PREFIX}${code}`, JSON.stringify(gameData), "EX", EXPIRE);
};

export const getPlayers = async (cache, code) => {
    const data = await cache.get(`${PLAYER_PREFIX}${code}`);
    return data ? JSON.parse(data) : {};
};

export const updatePlayers = async (cache, code, players) => {
    await cache.set(`${PLAYER_PREFIX}${code}`, JSON.stringify(players), "EX", EXPIRE);
};

export const deleteGame = async (cache, code) => {
    await cache.del(`${GAME_PREFIX}${code}`);
    await cache.del(`${PLAYER_PREFIX}${code}`);
};

export const createPlayer = (username) => {
    const { error } = usernameSchema.validate(username);

    if (error) return -1;
    return uuidv4();
};
