import { Loading } from "../utility/Loading.jsx";
import { Error } from "../utility/Error.jsx";
import { useParams } from "react-router";
import { getAllResponses } from "../../api/responses.js";

// import { getAllResults } from "../../api/auth.js";
import { useEffect, useState } from "react";
import { ResultDetailCard } from "./results/details/ResultDetailCard.jsx";

export function ResultsPanel() {
  // NOTE:
  // The API will not be paginated here
  // All results will simply be retrieved at once
  // Since this is redis, it isn't too bad
  // Especially since old entries will expire on their own

  let { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // const data = await getAllResults();
        // TODO: Dummy data, should be replaced with a real API call

        const responses = await getAllResponses();
        //setQuestions(responses?.questions?.questions);
        // console.log(responses);
        setResponses(responses?.data);
      } catch (err) {
        console.log("[Dashboard]", err);
        setError("Fetching error! Try reloading the page?");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

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
          {responses?.map((response) => (
            <ResultDetailCard
              key={response.longCode}
              id={response.longCode}
              name={response.name}
              lastPlayed={response.createdAt}
              totalResponses={1}
              averageScore={0.6}
              setResponses={setResponses}
            />
          ))}
        </div>
      </div>

      {responses.length === 0 && (
        <div className="text-center text-primary">
          <Error message="No results found! Try hosting a game?" />
        </div>
      )}
    </>
  );
}
