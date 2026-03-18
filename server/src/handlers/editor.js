import consola from "consola";
import Joi from "joi";

const questionSchema = Joi.object({
    description: Joi.string().trim().min(3).max(1500).required(),
    shortAnswer: Joi.boolean().required()
});

const answerSchema = Joi.object({
    description: Joi.string().trim().min(3).max(500).required(),
    correct: Joi.boolean().required()
});

export const getAll = async (req, res) => {
    const uid = req.user.id;
    const { id } = req.params;

    try {
        const connection = await req.server.mysql.getConnection();
        const data = {
            id: -1,
            name: "",
            description: "",
            questions: []
        };

        // Fetch details
        const [details] = await connection.query(
            "SELECT ID, Name, Description FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, uid],
        );

        if (details.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        data.id = details.id;
        data.name = details.Name;
        data.description = details.Description;

        // Fetch questions
        const [questions] = await connection.query(
            "SELECT ID, Description, ShortAnswer, CreatedAt, UpdatedAt FROM Questions WHERE QuizID = ?",
            [id],
        );

        for (const question of questions) {
            const q = {
                id: question.ID,
                description: question.Description,
                shortAnswer: question.ShortAnswer,
                createdAt: question.CreatedAt,
                updatedAt: question.UpdatedAt,
            };

            if (!q.shortAnswer) {
                const [answers] = await connection.query(
                    "SELECT ID, Description, Correct, CreatedAt, UpdatedAt FROM Answers WHERE QuestionID = ?",
                    [q.id]
                );

                q.answers = [];

                for (const answer of answers) {
                    q.answers.push({
                        id: answer.ID,
                        description: answer.Description,
                        correct: answer.Correct,
                        createdAt: answer.CreatedAt,
                        updatedAt: answer.UpdatedAt,
                    });
                }
            }

            data.questions.push(q);
        }

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Quiz details fetched successfully.",
            data,
        });
    } catch (err) {
        consola.info(`[editor] Cannot fetch all details - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
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

    try {
        const connection = await req.server.mysql.getConnection();

        // Does user own the quiz?
        const [owned] = await connection.query(
            "SELECT 1 FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, uid],
        );

        if (owned.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        // Quiz exists and user owns it, safe to insert
        const [result] = await connection.query(
            "INSERT INTO Questions (QuizID, Description, ShortAnswer) VALUES (?, ?, ?)",
            [id, req.body.description, req.body.shortAnswer],
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Question was created successfully.",
            data: { id: result.insertId },
        });
    } catch (err) {
        consola.info(`[editor] Cannot create question - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteQuestion = async (req, res) => {};

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

    try {
        const connection = await req.server.mysql.getConnection();

        // Does user own the quiz?
        const [owned] = await connection.query(
            "SELECT 1 FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, uid],
        );

        if (owned.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        // Does the question exist? Is it multiple choice?
        const [mp] = await connection.query(
            "SELECT 1 FROM Questions WHERE ID = ? AND ShortAnswer = false LIMIT 1",
            [qid]
        );

        if (mp.length == 0) {
            return res.code(404).send({
                statusCode: 400,
                message: "Invalid question!",
            });
        }

        // Quiz exists and user owns it, question is multiple choice, we can insert
        const [result] = await connection.query(
            "INSERT INTO Answers (QuestionID, Description, Correct) VALUES (?, ?, ?)",
            [qid, req.body.description, req.body.correct],
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Answer was created successfully.",
            data: { id: result.insertId },
        });
    } catch (err) {
        consola.info(`[editor] Cannot create answer - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteAnswer = async (req, res) => {};

export const swapQuestion = async (req, res) => {};
