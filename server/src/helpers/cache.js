import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const usernameSchema = Joi.string().trim().min(3).max(50).required();

export const GAME_PREFIX = "game:";
export const PLAYER_PREFIX = "players:";
export const EXPIRE = 86400;

// TODO: KILL
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

export const createGame = async (cache, hostID, quizID) => {
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
