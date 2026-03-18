import router from "./router.js";

import auth from "../middleware/auth.js";
import allow from "../middleware/allow.js";

import { register, login, whoami, update } from "../handlers/users.js";
import {
    getQuizzes,
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
} from "../handlers/quizzes.js";

import {
    getAll,
    createQuestion,
    deleteQuestion,
    createAnswer,
    deleteAnswer,
} from "../handlers/editor.js";

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
    r.get("/@me/quiz", { onRequest: [r.auth] }, getQuizzes);
    r.post("/@me/quiz", { onRequest: [r.auth] }, createQuiz);

    r.get("/@me/quiz/:id", { onRequest: [r.auth] }, getQuiz);
    r.patch("/@me/quiz/:id", { onRequest: [r.auth] }, updateQuiz);
    r.delete("/@me/quiz/:id", { onRequest: [r.auth] }, deleteQuiz);

    // Questions
    r.get("/@me/quiz/:id/editor", { onRequest: [r.auth] }, getAll);
    r.post("/@me/quiz/:id/editor", { onRequest: [r.auth] }, createQuestion);
    r.delete("/@me/quiz/:id/editor", { onRequest: [r.auth] }, deleteQuestion);

    // Answers
    r.post("/@me/quiz/:id/editor/:qid", { onRequest: [r.auth] }, createAnswer);
    r.delete("/@me/quiz/:id/editor/:qid", { onRequest: [r.auth] }, deleteAnswer);

    // TODO: Responses
});

