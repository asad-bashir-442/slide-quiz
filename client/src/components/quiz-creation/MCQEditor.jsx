import { createAnswerById, getAllQuestionsById, updateAnswerById } from "../../api/editor";

import { Error } from "../utility/Error";
import { DeleteQuestionButton } from "../editor/DeleteQuestionButton";
import { MCQInput } from "./MCQInput";
import { EditQuestonButton } from "../editor/EditQuestionButton";

import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function MCQEditor({ question, setQuestions, questionNum }) {
    const [tempAnswers, setTempAnswers] = useState(question?.answers || []);

    const { id } = useParams();

    useEffect(() => {
        setTempAnswers(question?.answers ?? []);
    }, [question?.answers]);

    function handleAnswerChange(index, updatedAnswer) {
        const updated = [...tempAnswers];

        updated[index] = updatedAnswer;
        setTempAnswers(updated);
    }

    function addTempAnswer() {
        setTempAnswers((prev) => [
            ...prev,
            {
                description: "",
                correct: false,
            },
        ]);
    }

    function deleteTempAnswer(index) {
        const updated = [...tempAnswers];

        updated.splice(index, 1);
        setTempAnswers(updated);
    }

    async function saveAnswers(e) {
        e.preventDefault();

        try {
            const newAnswers = tempAnswers.filter((answer) => !answer.id);
            const existingAnswers = tempAnswers.filter((answer) => answer.id);

            const createPromises = newAnswers.map((tempAnswer) =>
                createAnswerById(id, question.id, {
                    description: tempAnswer.description,
                    correct: tempAnswer.correct ?? false,
                }),
            );

            const updatePromises = existingAnswers.map((tempAnswer) =>
                updateAnswerById(id, question.id, tempAnswer.id, {
                    description: tempAnswer.description,
                    correct: Boolean(tempAnswer.correct),
                }),
            );

            await Promise.all([...createPromises, ...updatePromises]);

            // Refresh
            const updated = await getAllQuestionsById(id);

            setQuestions(updated.data.questions);
            toast.success("Answers saved!");
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div id={`question_linkto_${question.id}`} className="w-[90%] mx-auto mb-10 p-6 bg-base-100 rounded-xl shadow-md flex flex-col gap-6">
            {/* Top row */}
            <div>
                <div className="flex justify-between">
                    <h3 className="text-md">Question {questionNum}</h3>
                    <EditQuestonButton points={question.points} description={question.description} quizId={id} questionId={question.id} setQuestions={setQuestions} />
                </div>

                <p className="text-sm">Points: {question.points}</p>

                <div className="flex items-center justify-between flex-col lg:flex-row">
                    <h1 className="text-2xl break-all my-3 md:text-4xl font-bold mr-2 max-[1024px]:mb-8">{question?.description}</h1>

                    <DeleteQuestionButton question={question} setQuestions={setQuestions} />
                </div>
            </div>

            {question?.shortAnswer ? (
                <></>
            ) : (
                <form className="flex flex-col gap-4" onSubmit={saveAnswers}>
                    <ol className="min-[900px]:list-[upper-alpha] list-inside font-bold">
                        {tempAnswers?.length === 0 ? (
                            <div className="text-center text-primary my-8">
                                <Error message="No Answers Saved! Try creating one?" />
                            </div>
                        ) : (
                            tempAnswers?.map((tempAnswer, index) => (
                                <MCQInput
                                    index={index}
                                    key={tempAnswer.id || `temp-${index}`}
                                    description={tempAnswer.description}
                                    correct={tempAnswer.correct}
                                    onChange={(updated) => handleAnswerChange(index, updated)}
                                    answerId={tempAnswer.id}
                                    question={question}
                                    setQuestions={setQuestions}
                                    deleteTempAnswer={deleteTempAnswer}
                                />
                            ))
                        )}
                    </ol>

                    <div className="flex justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                        <button type="button" onClick={addTempAnswer} className="btn btn-lg btn-primary rounded-md py-2">
                            Add Response
                        </button>

                        <button className="btn btn-secondary btn-lg rounded-lg">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
