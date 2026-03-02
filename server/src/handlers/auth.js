import router from "../router/router.js";

import consola from "consola";
import bcrypt from "bcrypt";
import Joi from "joi";

const hashamt = 10;
const expires = "10h";

const registerSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "ca"] },
    }),

    password: Joi.string().min(5).max(20).required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "ca"] },
        })
        .required(),

    password: Joi.string().min(5).max(20).required(),
});

export const register = async (req, res) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid register body.",
        });
    }

    try {
        const connection = await req.server.mysql.getConnection();
        const { name, email } = req.body;

        // User exists?
        const [existing] = await connection.query(
            "SELECT ID FROM Users WHERE Email = ? LIMIT 1",
            [email],
        );

        if (existing.length > 0) {
            return res.code(409).send({
                statusCode: 409,
                message: "Email in use.",
            });
        }

        // Hash and insert
        const hash = await bcrypt.hash(req.body.password, hashamt);

        const [result] = await connection.query(
            `INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)`,
            [name, email, hash],
        );

        const token = router.jwt.sign(
            {
                id: result.insertId,
                name: name,
                email: email,
            },

            { expiresIn: expires },
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            data: { token },
            message: `User ${name} (${email}) created.`,
        });
    } catch (err) {
        consola.error(`[auth] Could not create user - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const login = async (req, res) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid login body.",
        });
    }

    try {
        const connection = await req.server.mysql.getConnection();

        // User exists?
        const [users] = await connection.query(
            "SELECT ID, Username, Email, Password FROM Users WHERE Email = ? LIMIT 1",
            [req.body.email],
        );

        if (users.length == 0) {
            return res.code(401).send({
                statusCode: 401,
                message: "Invalid username/password.",
            });
        }

        const user = users[0];
        const match = await bcrypt.compare(req.body.password, user.Password);

        if (!match) {
            return res.code(401).send({
                statusCode: 401,
                message: "Invalid username/password.",
            });
        }

        const token = router.jwt.sign(
            {
                id: user.ID,
                name: user.Username,
                email: user.Email,
            },

            { expiresIn: expires },
        );

        connection.release();

        return res.code(200).send({
            statusCode: 200,
            data: { token },
            message: `Welcome ${user.Username}.`,
        });
    } catch (err) {
        consola.error(`[auth] Could not compare password - ${err}`);

        return res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const whoami = async (req, res) => {
    res.send({
        statusCode: 200,
        message: `Found ${req.user.name}.`,
        data: req.user,
    });
};
