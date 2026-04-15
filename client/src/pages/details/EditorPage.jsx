import { getQuizById } from "../../api/quiz";
import { getAllQuestionsById } from "../../api/editor";

import { Error } from "../../components/utility/Error";
import { MCQEditor } from "../../components/editor/mcq/MCQEditor";
import { QuestionNoButton } from "../../components/editor/buttons/QuestionNoButton";
import { NewQuestionButton } from "../../components/editor/buttons/NewQuestionButton";

import { ago } from "../../utility/date";
import { fadeIn } from "../../utility/animation";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export function EditorPage() {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [severError, setServerError] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        document.title = "SlideQuiz | Editor";

        const fetchQuiz = async () => {
            try {
                const quizData = await getQuizById(id);
                const questionData = await getAllQuestionsById(id);

                setQuiz(quizData.data);
                setQuestions(questionData.data.questions);
            } catch (error) {
                setServerError(error.message);
            }
        };

        fetchQuiz();
    }, [id]);

    if (severError) {
        return (
            <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-6xl">404</h1>
                <p>Quiz Not Found</p>
            </div>
        );
    }

    return (
        <motion.div {...fadeIn} className="flex-1">
            <div className="p-6">
                <h1 className="text-3xl font-bold capitalize">{quiz?.name}</h1>
                <h2 className="opacity-70">Saved - {ago(quiz?.updatedAt)}</h2>
            </div>

            <div className="flex items-start">
                <div className="w-1/4 p-6 bg-base-200 flex flex-col gap-4 max-lg:hidden rounded-xl sticky top-0">
                    {questions?.map((question, index) => (
                        <QuestionNoButton id={question.id} num={index + 1} />
                    ))}
                </div>

                <div className="w-3/4 flex flex-col mx-auto max-[900px]:w-full">
                    <div>
                        {questions?.length > 0 ? (
                            questions.map((question, index) => <MCQEditor key={question.id || `temp-${index}`} questionNum={index + 1} question={question} setQuestions={setQuestions} />)
                        ) : (
                            <div className="text-center text-primary">
                                <Error message="No questions found! Try creating one?" />
                            </div>
                        )}
                    </div>

                    <NewQuestionButton setQuestions={setQuestions} />
                </div>
            </div>
        </motion.div>
    );
}
