import { Loading } from "../utility/Loading.jsx";
import { Error } from "../utility/Error.jsx";
import { useParams } from "react-router";
import { getAllResponses } from "../../api/responses.js";

import { useEffect, useState } from "react";
import { ResultDetailCard } from "./results/details/ResultDetailCard.jsx";

export function ResultsPanel({ loading, error, responses, setResponses }) {
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
              mode={response.mode}
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
