import router from "./router.js";

import auth from "../middleware/auth.js";
import allow from "../middleware/allow.js";

import { register, login, whoami, update } from "../handlers/auth.js";
import {
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
} from "../handlers/quiz.js";

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
    r.patch("/@me", { onRequest: [r.auth] }, update);

    // Quiz
    r.post("/@me/quiz", { onRequest: [r.auth] }, createQuiz);
    r.get("/@me/quiz/:id", { onRequest: [r.auth] }, getQuiz);
    r.patch("/@me/quiz/:id", { onRequest: [r.auth] }, updateQuiz);
    r.delete("/@me/quiz/:id", { onRequest: [r.auth] }, deleteQuiz);
});
