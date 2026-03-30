import { useState, useEffect } from "react";
import { DeleteQuestionButton } from "../editor/DeleteQuestionButton";
import { MCQInput } from "./MCQInput";
import { useParams } from "react-router";
import { createAnswerById, getAllQuestionsById } from "../../api/editor";
import { toast } from "sonner";
import { truncateText } from "../../utility/truncate";
import { Error } from "../utility/Error";

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
        correct: false,
      },
    ]);
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
          correct: tempAnswer.correct ?? false,
        }),
      );

      await Promise.all(promises);
      const updated = await getAllQuestionsById(id);
      setQuestions(updated.data.questions);

      toast.success("Answers saved!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-[90%] mx-auto mt-10 mb-10 p-6 bg-base-100 rounded-xl shadow-md flex flex-col gap-6">
      {/* Top row */}
      <div>
        <h3 className="text-md">Question {questionNum}</h3>
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <h1 className="text-2xl my-3 md:text-4xl font-bold">
            {truncateText(question?.description, 20)}
          </h1>
          <DeleteQuestionButton
            question={question}
            setQuestions={setQuestions}
          />
        </div>
      </div>

      {/* Response inputs */}

      {question?.shortAnswer ? (
        // <textarea
        //   placeholder="Any Text (Multi-Line)"
        //   readOnly
        //   className="textarea w-full resize-none h-20"
        // />
        <></>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={saveAnswers}>
          {tempAnswers?.length === 0 ? (
            <div className="text-center text-primary">
              <Error message="No Answers Saved! Try creating one?" />
            </div>
          ) : (
            tempAnswers?.map((tempAnswer, index) => (
              <MCQInput
                key={tempAnswer.id || `temp-${index}`}
                letter={index + 1}
                description={tempAnswer.description}
                correct={tempAnswer.correct}
                onChange={(updated) => handleAnswerChange(index, updated)}
                answerId={tempAnswer.id}
                question={question}
                setQuestions={setQuestions}
              />
            ))
          )}

          <div className="flex justify-between flex-col sm:flex-row gap-4 sm:gap-0">
            <button
              type="button"
              onClick={addTempAnswer}
              className="btn btn-lg btn-primary rounded-md py-2"
            >
              Add Response
            </button>

            <button className="btn btn-secondary btn-lg rounded-lg">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
