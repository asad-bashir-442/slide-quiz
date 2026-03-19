import { QuizDetailCard } from "../dashboard/quiz/details/QuizDetailCard.jsx";
import { Loading } from "../utility/Loading.jsx";
import { Error } from "../utility/Error.jsx";
import { getAllQuizzes } from "../../api/quiz.js";
import { useEffect, useState } from "react";

export function QuizPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes(1);

        if (data?.statusCode == 200) {
          setQuizzes(data.data);
          setHasMore(data.data.length > 0);
          setError("");
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.log("[Dashboard]", err);
        setError("Fetching error! Try reloading the page?");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;

    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const data = await getAllQuizzes(nextPage);

      if (data?.statusCode == 200) {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setQuizzes((prev) => {
            const newQuizzes = data.data.filter(
              (newQuiz) =>
                !prev.some((existingQuiz) => existingQuiz.id === newQuiz.id),
            );

            return [...prev, ...newQuizzes];
          });

          setPage(nextPage);
        }

        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log("[Dashboard]", err);
      setError("Fetching error! Try reloading the page?");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-error">
        <Error message={error} />
      </div>
    );

  return (
    <>
      <div className="flex justify-center">
        <div className="grid gap-8 mb-12 min-[1400px]:grid-cols-3 grid-cols-2 max-[900px]:grid-cols-1">
          {quizzes?.map((quiz) => (
            <QuizDetailCard
              key={quiz.id}
              quizName={quiz.name}
              description={quiz.description}
              dateCreated={new Date(quiz.createdAt).toLocaleDateString("en-US")}
              id={quiz.id}
              setQuizzes={setQuizzes}
              isAutomatic={quiz.automaticDefault}
            />
          ))}
        </div>
      </div>

      {quizzes.length > 0 && (
        <div className="flex justify-center mt-4 pb-8">
          <button
            onClick={loadMore}
            disabled={!hasMore || loadingMore}
            className={`btn btn-outline max-[900px]:w-[90%] ${!hasMore ? "btn-disabled" : "btn-primary"}`}
          >
            {loadingMore ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : hasMore ? (
              "Load More"
            ) : (
              "No More Quizzes"
            )}
          </button>
        </div>
      )}

      {quizzes.length === 0 && (
        <div className="text-center text-primary">
          <Error message="No quizzes found! Try creating one?" />
        </div>
      )}
    </>
  );
}
