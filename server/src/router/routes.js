import router from "./router.js";

import auth from "../middleware/auth.js";
import allow from "../middleware/allow.js";

import { register, login, whoami } from "../handlers/auth.js";

// Public routes
router.register(async (r) => {
    r.decorate("allowLogin", allow.login);
    r.decorate("allowRegister", allow.register);

    r.post("/@me/register", { onRequest: [r.allowRegister] }, register);
    r.post("/@me/login", { onRequest: [r.allowLogin] }, login);
});

// Private routes
router.register(async (r) => {
    r.decorate("auth", auth);

    // Auth
    r.post("/@me", { onRequest: [r.auth] }, whoami);
});
