import consola from "consola";
import Joi from "joi";

// TODO: Should be part of the .env
const limitamt = 9; // To match the UI, should be divisible by 3

const quizzesSchema = Joi.number().min(1).max(500).integer();

const quizSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(5).max(250).required(),
    automatic: Joi.boolean().required(),
});

const quizUpdateSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50),
    description: Joi.string().trim().min(5).max(250),
    automatic: Joi.boolean(),
});

export const getQuizzes = async (req, res) => {
    const uid = req.user.id;
    const page = req.query?.page || 1;

    const { error } = quizzesSchema.validate(page);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid page number.",
        });
    }

    try {
        const connection = await req.server.mysql.getConnection();
        const offset = (parseInt(page) - 1) * limitamt;

        const [results] = await connection.query(
            "SELECT ID, Name, Description, AutomaticDefault, CreatedAt, UpdatedAt FROM Quizzes WHERE UserID = ? ORDER BY UpdatedAt DESC LIMIT ?, ?",
            [uid, offset, limitamt]
        );

        const quizzes = [];

        for (const quiz of results) {
            quizzes.push({
                id: quiz.ID,
                name: quiz.Name,
                description: quiz.Description,
                automaticDefault: quiz.AutomaticDefault,
                createdAt: quiz.CreatedAt,
                updatedAt: quiz.UpdatedAt,
            })
        }

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Found quizzes.",
            data: quizzes,
        });
    } catch (err) {
        consola.info(`[auth] Cannot fetch quizzes - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
}

export const createQuiz = async (req, res) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = quizSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid create quiz body.",
        });
    }

    try {
        const connection = await req.server.mysql.getConnection();
        const details = {
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            automatic: String(req.body.automatic) == "true",
        };

        const [result] = await connection.query(
            "INSERT INTO Quizzes (UserID, Name, Description, AutomaticDefault) VALUES (?, ?, ?, ?)",
            [req.user.id, details.name, details.description, details.automatic],
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: `${details.name} was created successfully.`,
            data: {
                id: result.insertId,
                name: details.name,
                description: details.description,
                automatic: details.automatic,
            },
        });
    } catch (err) {
        consola.info(`[auth] Cannot create quiz - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const getQuiz = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await req.server.mysql.getConnection();
        const [results] = await connection.query(
            "SELECT Name, Description, AutomaticDefault, CreatedAt, UpdatedAt FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, req.user.id],
        );

        if (results.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        const quiz = results[0];

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Found quiz.",
            data: {
                name: quiz.Name,
                description: quiz.Description,
                automaticDefault: quiz.AutomaticDefault,
                createdAt: quiz.CreatedAt,
                updatedAt: quiz.UpdatedAt,
            },
        });
    } catch (err) {
        consola.info(`[auth] Cannot fetch quiz - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const updateQuiz = async (req, res) => {
    const { id } = req.params;

    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = quizUpdateSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid update quiz body.",
        });
    }

    try {
        const connection = await req.server.mysql.getConnection();

        // Does quiz exist?
        const [quizzes] = await connection.query(
            "SELECT Name, Description, AutomaticDefault FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, req.user.id],
        );

        if (quizzes.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        const quiz = quizzes[0];
        const details = {
            name: quiz.Name,
            description: quiz.Description,
            automatic: quiz.AutomaticDefault == 1,
        };

        // Does name exist?
        if (req.body.name) {
            details.name = req.body.name;
            consola.info(`${id} name is being updated`);
        }

        // Does description exist?
        if (req.body.description) {
            details.description = req.body.description;
            consola.info(`${id} description is being updated`);
        }

        // Does automatic default exist?
        if (req.body.automatic !== undefined) {
            details.automatic = String(req.body.automatic) == "true";
            consola.info(`${id} automatic is being updated`);
        }

        // Update
        await connection.query(
            "UPDATE Quizzes SET Name = ?, Description = ?, AutomaticDefault = ? WHERE ID = ? AND UserID = ?",
            [
                details.name,
                details.description,
                details.automatic,
                id,
                req.user.id,
            ],
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Updated quiz.",
            data: details,
        });
    } catch (err) {
        consola.info(`[auth] Cannot update quiz - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await req.server.mysql.getConnection();

        // Does quiz exist?
        const [exists] = await connection.query(
            "SELECT 1 FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1",
            [id, req.user.id],
        );

        if (exists.length == 0) {
            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        await connection.query(
            "DELETE FROM Quizzes WHERE ID = ? AND UserID = ?",
            [id, req.user.id],
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Removed quiz.",
        });
    } catch (err) {
        consola.info(`[auth] Cannot delete quiz - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
