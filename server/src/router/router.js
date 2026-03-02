import Fastify from "fastify";

import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const fastify = Fastify();
const secret = process.env.JWT_SECRET;
const origin = process.env.CORS_ALLOW.split(",");

fastify.register(jwt, { secret });
fastify.register(cors, {
    origin,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Accept", "Authorization", "Content-Type"],
    maxAge: 100,
});

fastify.register(multipart, {
    limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 5,
        fileSize: parseInt(process.env.UPLOAD_SIZE),
        files: parseInt(process.env.UPLOAD_AMOUNT),
        headerPairs: 2000,
    },
});

export default fastify;
