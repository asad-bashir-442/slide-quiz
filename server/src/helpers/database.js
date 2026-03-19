import consola from "consola";

export const queryQuestions = async (database, userID, quizID) => {
    try {
        const connection = await database.getConnection();
        const data = {
            id: -1,
            name: "",
            description: "",
            questions: [],
        };

        // Fetch details
        const [details] = await connection.query("SELECT ID, Name, Description FROM Quizzes WHERE ID = ? AND UserID = ? LIMIT 1", [quizID, userID]);

        if (details.length == 0) {
            return 404;
        }

        data.id = details[0].ID;
        data.name = details[0].Name;
        data.description = details[0].Description;

        // Fetch questions
        const [questions] = await connection.query("SELECT ID, Description, ShortAnswer, Points, CreatedAt, UpdatedAt FROM Questions WHERE QuizID = ?", [quizID]);

        for (const question of questions) {
            const q = {
                id: question.ID,
                description: question.Description,
                shortAnswer: question.ShortAnswer,
                points: question.Points,
                createdAt: question.CreatedAt,
                updatedAt: question.UpdatedAt,
            };

            if (!q.shortAnswer) {
                const [answers] = await connection.query("SELECT ID, Description, Correct, CreatedAt, UpdatedAt FROM Answers WHERE QuestionID = ?", [q.id]);

                q.answers = [];

                for (const answer of answers) {
                    q.answers.push({
                        id: answer.ID,
                        description: answer.Description,
                        correct: answer.Correct,
                        createdAt: answer.CreatedAt,
                        updatedAt: answer.UpdatedAt,
                    });
                }
            }

            data.questions.push(q);
        }

        connection.release();
        return data;
    } catch (err) {
        consola.info(`[database] Cannot fetch all details - ${err}`);
        return -1;
    }
};
