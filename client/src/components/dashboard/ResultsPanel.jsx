import { Loading } from "../utility/Loading.jsx";
import { Error } from "../utility/Error.jsx";

// import { getAllResults } from "../../api/auth.js";
import { useEffect, useState } from "react";
import { ResultDetailCard } from "./results/details/ResultDetailCard.jsx";

export function ResultsPanel() {
  // NOTE:
  // The API will not be paginated here
  // All results will simply be retrieved at once
  // Since this is redis, it isn't too bad
  // Especially since old entries will expire on their own

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResults() {
      try {
        // const data = await getAllResults();
        // TODO: Dummy data, should be replaced with a real API call
        const data = {
          statusCode: 200,
          data: [
            { id: 0, name: "Countries of the world", lastPlayed: "2020-01-01", totalResponses: 25, averageScore: 0.5 },
            { id: 1, name: "Countries of the world 2", lastPlayed: "2020-01-01", totalResponses: 26, averageScore: 0.6 },
            { id: 2, name: "Countries of the world 2", lastPlayed: "2020-01-01", totalResponses: 26, averageScore: 0.6 },
            { id: 3, name: "Countries of the world 2", lastPlayed: "2020-01-01", totalResponses: 26, averageScore: 0.6 },
            { id: 4, name: "Countries of the world 2", lastPlayed: "2020-01-01", totalResponses: 26, averageScore: 0.6 }
          ],

          message: "ok"
        };

        if (data?.statusCode == 200) {
          setResults(data.data);
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
    }

    fetchResults();
  }, []);

  if (loading) return (
    <div className="text-center">
      <Loading />
    </div>
  );

  if (error) return (
    <div className="text-center text-error">
      <Error message={error} />
    </div>
  );

  return (
    <>
      <div className="flex justify-center">
        <div className="grid gap-8 mb-12 min-[1400px]:grid-cols-3 grid-cols-2 max-[900px]:grid-cols-1">
          {results?.map((result) => (
            <ResultDetailCard
              key={result.id}
              id={result.id}
              name={result.name}
              lastPlayed={result.lastPlayed}
              totalResponses={result.totalResponses}
              averageScore={result.averageScore}
            />
          ))}
        </div>
      </div>

      {results.length === 0 && (
        <div className="text-center text-primary">
          <Error message="No results found! Try hosting a game?" />
        </div>
      )}
    </>
  );
};

