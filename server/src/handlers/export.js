import consola from "consola";
import Joi from "joi";

import { json2csv } from "json-2-csv";
import { queryQuestions } from "../helpers/database.js";
import { getSession, getResponses } from "../helpers/cache.js";

const idSchema = Joi.string().uuid().required();

const options = {
    unwindArrays: true,
    expandArrayObjects: true,
};

export const exportQuiz = async (req, res) => {
    const data = await queryQuestions(req.server.mysql, req.user.id, req.params.id);

    if (data === 404) {
        return res.code(404).send({
            statusCode: 404,
            message: "Quiz not found.",
        });
    }

    if (data === -1) {
        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }

    try {
        return res.code(200).send(await json2csv(data, options));
    } catch (err) {
        consola.error(`[export] Could not export quiz - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const exportResponse = async (req, res) => {
    const { id } = req.params;
    const { error } = idSchema.validate(id);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid ID.",
        });
    }

    try {
        const questions = await getSession(req.server.redis, req.user.id, id);
        const responses = await getResponses(req.server.redis, req.user.id, id);

        if (!questions || !responses) {
            return res.code(404).send({
                statusCode: 404,
                message: "No responses/questions found.",
            });
        }

        // Strip socket connection IDs
        for (const question in responses) {
            for (const id in responses[question]) {
                const answer = responses[question][id];

                responses[question][answer.player.id] = {
                    username: answer.player.username,
                    response: answer.response,
                };

                delete responses[question][id];
            }
        }

        return res.code(200).send(await json2csv({ questions, responses }, options));
    } catch (err) {
        consola.error(`[export] Could not export response - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
