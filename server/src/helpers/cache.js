import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const usernameSchema = Joi.string().trim().min(3).max(15).required();
const codelen = parseInt(process.env.CODE_LENGTH) || 4;

export const GAME_PREFIX = "game:";
export const PLAYER_PREFIX = "game:players:";
export const RESPONSES_PREFIX = "game:responses:";

export const EXPIRE = 86400; // 24 hours
export const EXPIRE_LONG = 86400 * 7; // 1 week

const formatQuestion = (question) => {
    const result = {
        id: uuidv4(),
        description: question.description,
        shortAnswer: question.shortAnswer,
        points: question.points,
    };

    if (!result.shortAnswer) {
        result.answers = question.answers.map((a) => ({
            id: uuidv4(),
            description: a.description,
            correct: a.correct
        }));
    }

    return result;
}

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
            index: -1,
            mode,

            // Disconnect data from the database
            questions: game.questions.map(formatQuestion),

            // Reduce the likelyhood of collisions
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

export const hasResponse = async (cache, owner, longCode, socketID, questionIndex) => {
    return await cache.hexists(`${RESPONSES_PREFIX}${owner}:${longCode}:${questionIndex}`, socketID);
};

export const getResponses = async (cache, owner, longCode) => {
    const pattern = `${RESPONSES_PREFIX}${owner}:${longCode}:*`;
    const responseKeys = await cache.keys(pattern);

    const responses = {};

    for (const key of responseKeys) {
        const questionIndex = parseInt(key.split(":").pop());
        const answers = await cache.hgetall(key);

        if (answers && Object.keys(answers).length > 0) {
            responses[questionIndex] = {};

            for (const [socketID, answerData] of Object.entries(answers)) {
                responses[questionIndex][socketID] = JSON.parse(answerData);
            }
        }
    }

    return responses;
};

// Sessions
export const createResponseSession = async (cache, owner, longCode, name, questions, mode) => {
    const sessionKey = `${RESPONSES_PREFIX}${owner}:${longCode}`;
    const userSessionsKey = `${RESPONSES_PREFIX}user:${owner}`;

    await cache.set(
        sessionKey,
        JSON.stringify({
            name,
            questions,
            mode,
            createdAt: Date.now(),
            longCode,
        }),

        "EX",
        EXPIRE_LONG,
    );

    await cache.zadd(userSessionsKey, Date.now(), longCode);
    await cache.expire(userSessionsKey, EXPIRE_LONG);
};

export const getSession = async (cache, owner, longCode) => {
    const key = `${RESPONSES_PREFIX}${owner}:${longCode}`;
    const data = await cache.get(key);

    return data ? JSON.parse(data) : null;
};

export const getAllSessions = async (cache, owner) => {
    const key = `${RESPONSES_PREFIX}user:${owner}`;
    const codes = await cache.zrevrange(key, 0, -1);
    const sessions = [];

    for (const longCode of codes) {
        const sessionKey = `${RESPONSES_PREFIX}${owner}:${longCode}`;
        const data = await cache.get(sessionKey);

        if (data) {
            sessions.push(JSON.parse(data));
        } else {
            await cache.zrem(key, longCode);
        }
    }

    return sessions;
};

export const deleteResponseSession = async (cache, owner, longCode) => {
    const sessionKey = `${RESPONSES_PREFIX}${owner}:${longCode}`;
    const userSessionsKey = `${RESPONSES_PREFIX}user:${owner}`;
    const exists = await cache.exists(sessionKey);

    if (!exists) {
        return false;
    }

    const pattern = `${RESPONSES_PREFIX}${owner}:${longCode}:*`;
    const responseKeys = await cache.keys(pattern);

    if (responseKeys.length > 0) {
        await cache.del(...responseKeys);
    }

    await cache.del(sessionKey);
    await cache.zrem(userSessionsKey, longCode);

    return true;
};

export const deleteAllResponseSessions = async (cache, owner) => {
    const pattern = `${RESPONSES_PREFIX}${owner}:*`;
    const keys = await cache.keys(pattern);

    if (keys.length > 0) {
        await cache.del(...keys);
    }

    await cache.del(`${RESPONSES_PREFIX}user:${owner}`);
    return keys.length;
};
