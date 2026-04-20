import { getAllResponses } from "../../api/responses.js";

import { Loading } from "../utility/Loading.jsx";
import { Error } from "../utility/Error.jsx";

import { ResultDetailCard } from "./results/details/ResultDetailCard.jsx";

import { useState, useEffect } from "react";

export function ResultsPanel({ responses, setResponses }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const responses = await getAllResponses();
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
                            mode={response.mode}
                            name={response.name}
                            lastPlayed={response.createdAt}
                            setResponses={setResponses}
                            numOfQuestion={response.questions}
                        />
                    ))}
                </div>
            </div>

            {responses.length === 0 && (
                <div className="text-center text-primary mb-10">
                    <Error message="No results found! Try hosting a game?" />
                </div>
            )}
        </>
    );
}
