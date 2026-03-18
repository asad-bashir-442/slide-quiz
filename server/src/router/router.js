import Fastify from "fastify";
import io from "fastify-socket.io";

import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import mysql from "@fastify/mysql";

const fastify = Fastify();
const secret = process.env.JWT_SECRET;
const origin = process.env.CORS_ALLOW.split(",");

fastify.register(jwt, { secret });
fastify.register(cors, {
    origin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
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

fastify.register(mysql, {
    promise: true,
    connectionString: String(process.env.DSN),
});


await fastify.register(io);

export default fastify;
