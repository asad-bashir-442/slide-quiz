import { useState, useEffect } from "react";
import { DeleteQuestionButton } from "../editor/DeleteQuestionButton";
import { MCQInput } from "./MCQInput";
import { useParams } from "react-router";
import { createAnswerById, deleteAnswerById } from "../../api/editor";
import { toast } from "sonner";

export function MCQEditor({ question, setQuestions, questionNum }) {
  const [tempAnswers, setTempAnswers] = useState(question?.answers || []);

  let { id } = useParams();

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
        isCorrect: false,
      },
    ]);
  }

  async function handleDelete() {
    try {
      const res = await deleteAnswerById(id, question?.id, question?.answerId);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function saveAnswers(e) {
    e.preventDefault();
    try {
      const newAnswers = tempAnswers.filter((answer) => !answer.id);

      if (newAnswers.length === 0) {
        toast.error("No answers to save");
        return;
      }

      console.log(newAnswers);

      const promises = newAnswers.map((tempAnswer) =>
        createAnswerById(id, question.id, {
          description: tempAnswer.description,
          correct: tempAnswer.isCorrect ?? false,
        }),
      );

      await Promise.all(promises);

      toast.success("Answers saved!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-[90%] mx-auto mt-10 mb-10 p-6 bg-base-200 rounded-xl shadow-md flex flex-col gap-6">
      {/* Top row */}
      <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4">
        <h3 className="text-lg opacity-70">Question #{questionNum}</h3>
        <h1 className="text-2xl font-bold">{question?.description}</h1>
        <DeleteQuestionButton question={question} setQuestions={setQuestions} />
      </div>

      {/* Response inputs */}

      {question?.shortAnswer ? (
        <textarea
          placeholder="Any Text (Multi-Line)"
          readOnly
          className="textarea w-full resize-none h-20"
        />
      ) : (
        <form className="flex flex-col gap-4" onSubmit={saveAnswers}>
          {tempAnswers?.map((tempAnswer, index) => (
            <MCQInput
              key={index}
              description={tempAnswer.description}
              isCorrect={tempAnswer.correct}
              onChange={(updated) => handleAnswerChange(index, updated)}
              handleDelete={handleDelete}
              answerId={tempAnswer.id}
              question={question}
              setQuestions={setQuestions}
            />
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addTempAnswer}
              className="btn btn-primary btn-lg rounded-lg"
            >
              Add New Response
            </button>

            <button className="btn btn-secondary btn-lg rounded-lg">
              Save
            </button>
          </div>
        </form>
      )}

      {/* Add Response Button */}
    </div>
  );
}
