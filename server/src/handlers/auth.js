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

    // TODO: User exists?
    let exists = false;

    if (exists) {
        return res.code(409).send({
            statusCode: 409,
            message: "Email in use.",
        });
    }

    // Hash and insert
    try {
        const hash = await bcrypt.hash(req.body.password, hashamt);

        // TODO: Insert token & data
        const user = {
            hash,
            id: 0,
            name: req.body.name,
            email: req.body.email,
        };

        const token = router.jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },

            { expiresIn: expires },
        );

        return res.code(200).send({
            statusCode: 200,
            data: { token },
            message: `User ${user.name} (${user.email}) created.`,
        });
    } catch (err) {
        consola.error(`[auth] Could not hash password - ${err}`);

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

    // TODO: Find user
    const user = {
        hash: "TODO THIS!!",
        id: 0,
        name: "Bobby",
        email: req.body.email,
    };

    try {
        if (!user) {
            return res.code(401).send({
                statusCode: 401,
                message: "Invalid username/password.",
            });
        }
    } catch (err) {
        consola.error(`[auth] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }

    try {
        const match = await bcrypt.compare(req.body.password, user.hash);

        if (!match) {
            return res.code(401).send({
                statusCode: 401,
                message: "Invalid username/password.",
            });
        }

        const token = router.jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },

            { expiresIn: expires },
        );

        return res.code(200).send({
            statusCode: 200,
            data: { token },
            message: `Welcome "${user.name}".`,
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
