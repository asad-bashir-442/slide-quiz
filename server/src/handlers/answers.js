import consola from "consola";
import Joi from "joi";

import { getResponses, getAllSessions, getSession, deleteResponseSession, deleteAllResponseSessions } from "../helpers/cache.js";

const idSchema = Joi.string().uuid().required();

export const getAllResponses = async (req, res) => {
    try {
        const sessions = await getAllSessions(req.server.redis, req.user.id);
        const sorted = sessions.sort((a, b) => a.createdAt - b.createdAt);

        // Don't return all questions
        for (const sesh of sorted) {
            sesh.questions = sesh.questions.length;
        }

        return res.code(200).send({
            statusCode: 200,
            data: sorted,
            message: "Fetched responses.",
        });
    } catch (err) {
        consola.error(`[answer] Cannot fetch all answers - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteResponses = async (req, res) => {
    try {
        const deleted = await deleteAllResponseSessions(req.server.redis, req.user.id);

        return res.code(200).send({
            statusCode: 200,
            code: { deleted },
            message: "Removed all responses.",
        });
    } catch (err) {
        consola.error(`[answer] Failed to delete all responses - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const getResponse = async (req, res) => {
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

        return res.code(200).send({
            statusCode: 200,
            data: { questions, responses },
            message: `Fetched responses for ${id}.`,
        });
    } catch (err) {
        consola.error(`[answer] Cannot fetch response - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteResponse = async (req, res) => {
    const { id } = req.params;
    const { error } = idSchema.validate(id);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid ID.",
        });
    }

    try {
        if (await deleteResponseSession(req.server.redis, req.user.id, id)) {
            return res.code(200).send({
                statusCode: 200,
                message: `Removed ${id}.`,
            });
        }

        return res.code(404).send({
            statusCode: 404,
            message: `${id} not found!`,
        });
    } catch (err) {
        consola.error(`[answer] Failed to delete response - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
