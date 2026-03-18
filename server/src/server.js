#!/usr/bin/env node

import "dotenv/config";
import "./router/routes.js";
import "./router/io.js";

import consola from "consola";
import router from "./router/router.js";

const { HOST, PORT } = process.env;

// Listen
router.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
        consola.fatal(err);
        process.exit(1);
    }

    consola.info(`Running on ${HOST}:${PORT}`);
});
