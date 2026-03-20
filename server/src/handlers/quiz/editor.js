import consola from "consola";
import Joi from "joi";

import { queryQuestions } from "../../helpers/database.js";

const idSchema = Joi.number().min(0).integer().required();

const questionSchema = Joi.object({
    description: Joi.string().trim().min(3).max(1500).required(),
    shortAnswer: Joi.boolean().required(),
    points: Joi.number().min(1).max(100).integer().required(),
});

const answerSchema = Joi.object({
    description: Joi.string().trim().min(3).max(500).required(),
    correct: Joi.boolean().required(),
});

export const getAll = async (req, res) => {
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

    return res.code(200).send({
        statusCode: 200,
        message: "Quiz details fetched successfully.",
        data,
    });
};

export const createQuestion = async (req, res) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    const uid = req.user.id;
    const { id } = req.params;

    // Valid body?
    const { error } = questionSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid create question body.",
        });
    }

    const connection = await req.server.mysql.getConnection();

    try {
        // Does user own the quiz?
        const [owned] = await connection.query("SELECT 1 FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1", [id, uid]);

        if (owned.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        // Quiz exists and user owns it, safe to insert
        const [result] = await connection.query("INSERT INTO Questions (QuizID, Description, ShortAnswer, Points) VALUES (?, ?, ?, ?)", [
            id,
            req.body.description,
            req.body.shortAnswer,
            req.body.points,
        ]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Question was created successfully.",
            data: { id: result.insertId },
        });
    } catch (err) {
        consola.info(`[editor] Cannot create question - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteQuestion = async (req, res) => {
    const uid = req.user.id;

    const { id } = req.params;
    const { question } = req.query;
    const { error } = idSchema.validate(question);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid question ID.",
        });
    }

    const connection = await req.server.mysql.getConnection();

    try {
        // Does the question exist? Does user own the quiz?
        const [exists] = await connection.query(
            `
                SELECT 1 FROM Questions q JOIN Quizzes z
                ON q.QuizID = z.ID
                WHERE q.QuizID = ? AND z.UserID = ? AND q.ID = ?
                LIMIT 1
            `,

            [id, uid, question],
        );

        if (exists.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 404,
                message: "Question not found!",
            });
        }

        // It exists, we can delete
        await connection.query("DELETE FROM Questions WHERE ID = ?", [question]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Removed question.",
        });
    } catch (err) {
        consola.error(`[editor] Cannot delete question - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const createAnswer = async (req, res) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    const uid = req.user.id;
    const { id, qid } = req.params;

    // Valid body?
    const { error } = answerSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid create answer body.",
        });
    }

    const connection = await req.server.mysql.getConnection();

    try {
        // Does the question exist and is it from the specified quiz? Is it multiple choice?
        const [exists] = await connection.query(
            `
                SELECT 1 FROM Questions q JOIN Quizzes z
                ON q.QuizID = z.ID
                WHERE q.QuizID = ? AND z.UserID = ? AND q.ID = ? AND q.ShortAnswer = false
                LIMIT 1
            `,

            [id, uid, qid],
        );

        if (exists.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 400,
                message: "Invalid question!",
            });
        }

        // Quiz exists and user owns it, question is multiple choice, we can insert
        const [result] = await connection.query("INSERT INTO Answers (QuestionID, Description, Correct) VALUES (?, ?, ?)", [qid, req.body.description, req.body.correct]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Answer was created successfully.",
            data: { id: result.insertId },
        });
    } catch (err) {
        consola.info(`[editor] Cannot create answer - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteAnswer = async (req, res) => {
    const uid = req.user.id;

    const { id, qid } = req.params;
    const { answer } = req.query;
    const { error } = idSchema.validate(answer);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid answer ID.",
        });
    }

    const connection = await req.server.mysql.getConnection();

    try {
        // Does the answer exist? Does user own the quiz?
        const [exists] = await connection.query(
            `
                SELECT 1 FROM Answers a
                INNER JOIN Questions q ON a.QuestionID = q.ID
                INNER JOIN Quizzes z ON q.QuizID = z.ID
                WHERE q.QuizID = ? AND z.UserID = ? AND q.ID = ? AND a.ID = ?
            `,

            [id, uid, qid, answer],
        );

        if (exists.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 404,
                message: "Answer not found!",
            });
        }

        // It exists, we can delete
        await connection.query("DELETE FROM Answers WHERE ID = ?", [answer]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Removed question.",
        });
    } catch (err) {
        consola.error(`[editor] Cannot delete answer - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
