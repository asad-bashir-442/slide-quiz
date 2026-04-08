import consola from "consola";
import Joi from "joi";

const limitamt = parseInt(process.env.PAGINATION) || 9;
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

    const connection = await req.server.mysql.getConnection();

    try {
        const offset = (parseInt(page) - 1) * limitamt;
        const quizzes = [];

        const [results] = await req.server.mysql.query("SELECT ID, Name, Description, AutomaticDefault, CreatedAt, UpdatedAt FROM Quizzes WHERE UserID = ? ORDER BY UpdatedAt DESC LIMIT ?, ?", [
            uid,
            offset,
            limitamt,
        ]);

        for (const quiz of results) {
            quizzes.push({
                id: quiz.ID,
                name: quiz.Name,
                description: quiz.Description,
                automaticDefault: quiz.AutomaticDefault,
                createdAt: quiz.CreatedAt,
                updatedAt: quiz.UpdatedAt,
            });
        }

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Found quizzes.",
            data: quizzes,
        });
    } catch (err) {
        consola.error(`[quizzes] Cannot fetch quizzes - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

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

    const connection = await req.server.mysql.getConnection();

    try {
        const details = {
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            automatic: String(req.body.automatic) == "true",
        };

        const [result] = await connection.query("INSERT INTO Quizzes (UserID, Name, Description, AutomaticDefault) VALUES (?, ?, ?, ?)", [
            req.user.id,
            details.name,
            details.description,
            details.automatic,
        ]);

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
        consola.error(`[quizzes] Cannot create quiz - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const getQuiz = async (req, res) => {
    const { id } = req.params;

    const connection = await req.server.mysql.getConnection();

    try {
        const [results] = await connection.query("SELECT Name, Description, AutomaticDefault, CreatedAt, UpdatedAt FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1", [id, req.user.id]);

        if (results.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Found quiz.",
            data: {
                name: results[0].Name,
                description: results[0].Description,
                automaticDefault: results[0].AutomaticDefault,
                createdAt: results[0].CreatedAt,
                updatedAt: results[0].UpdatedAt,
            },
        });
    } catch (err) {
        consola.error(`[quizzes] Cannot fetch quiz - ${err}`);
        connection.release();

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

    const connection = await req.server.mysql.getConnection();

    try {
        // Does quiz exist?
        const [quizzes] = await connection.query("SELECT Name, Description, AutomaticDefault FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1", [id, req.user.id]);

        if (quizzes.length == 0) {
            connection.release();

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
        }

        // Does description exist?
        if (req.body.description) {
            details.description = req.body.description;
        }

        // Does automatic default exist?
        if (req.body.automatic !== undefined) {
            details.automatic = String(req.body.automatic) == "true";
        }

        // Update
        await connection.query("UPDATE Quizzes SET Name = ?, Description = ?, AutomaticDefault = ? WHERE ID = ? AND UserID = ?", [
            details.name,
            details.description,
            details.automatic,
            id,
            req.user.id,
        ]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Updated quiz.",
            data: details,
        });
    } catch (err) {
        consola.error(`[quizzes] Cannot update quiz - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteQuiz = async (req, res) => {
    const { id } = req.params;
    const connection = await req.server.mysql.getConnection();

    try {
        // Does quiz exist?
        const [exists] = await connection.query("SELECT 1 FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1", [id, req.user.id]);

        if (exists.length == 0) {
            connection.release();

            return res.code(404).send({
                statusCode: 404,
                message: "Quiz not found!",
            });
        }

        await connection.query("DELETE FROM Quizzes WHERE ID = ? AND UserID = ?", [id, req.user.id]);

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            message: "Removed quiz.",
        });
    } catch (err) {
        consola.error(`[quizzes] Cannot delete quiz - ${err}`);
        connection.release();

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
