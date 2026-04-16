import { getReponseById } from "../../api/responses";

import { fadeIn } from "../../utility/animation";
import { truncateText } from "../../utility/truncate";
import { TrophyBox } from "../../components/results/TrophyBox";

import { toast } from "sonner";
import { motion } from "motion/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserPopup } from "../../components/results/UserPopup";

export function ResultsPage() {
    const { id } = useParams();

    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [quizName, setQuizName] = useState("");

    const [maxTotalPoints, setMaxTotalPoints] = useState(0);
    const [top3Players, setTop3Players] = useState(0);

    const [totalPoints, setTotalPoints] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [totalAnswers, setTotalAnswers] = useState(0);

    const [players, setPlayers] = useState([]);
    const [targetPlayer, setTargetPlayer] = useState([]);

    const formatPercent = (decimal) => {
        if (!decimal || !isFinite(decimal)) return 0;
        return Number((decimal * 100).toFixed(2));
    };

    const toggleModal = () => document.getElementById("responses_modal").showModal();

    useEffect(() => {
        document.title = "SlideQuiz | Results";

        const fetchResults = async () => {
            try {
                const data = await getReponseById(id);
                const playersMap = new Map();

                const name = data?.data?.questions.name;
                const questions = data?.data?.questions?.questions;
                const responses = data?.data?.responses;

                let maxPoints = 0;

                document.title = `SlideQuiz | ${truncateText(name, 25)} Results`;

                questions.forEach((question) => {
                    if (!question.shortAnswer) {
                        maxPoints += question.points;
                    }
                });

                Object.keys(responses).forEach((questionKey) => {
                    const questionResponses = responses[questionKey];

                    for (const [playerID, playerResponse] of Object.entries(questionResponses)) {
                        const username = playerResponse.username;

                        // Add if it doesn't exist
                        if (!playersMap.has(playerID)) {
                            playersMap.set(playerID, {
                                points: 0,
                                responses: 0,
                                name: username,
                                id: playerID,
                            });
                        }

                        const player = playersMap.get(playerID);

                        player.responses += 1;

                        if (playerResponse.response.correct === 1) {
                            const questionIndex = Number(questionKey);

                            // Don't track short answers
                            if (!questions[questionIndex].shortAnswer) {
                                player.points += questions[questionIndex]?.points || 0;
                            }
                        }
                    }
                });

                const sortedPlayers = [...playersMap.values()].toSorted((a, b) => b.points - a.points);

                let totalPlayerPoints = 0;
                let totalPlayerResponses = 0;

                sortedPlayers.forEach((player) => {
                    totalPlayerPoints += player.points;
                });

                const tempTop3Players = sortedPlayers.slice(0, 3);

                sortedPlayers.forEach((player) => {
                    totalPlayerResponses += player.responses;
                });

                setQuestions(questions);
                setResponses(responses);
                setQuizName(name);
                setMaxTotalPoints(maxPoints);
                setTotalPoints(totalPlayerPoints);
                setPlayers(sortedPlayers);
                setTotalPlayers(playersMap.size);
                setTop3Players(tempTop3Players);
                setTotalAnswers(totalPlayerResponses);
            } catch (error) {
                console.error(error.message);
                toast.error(error.message);
            }
        };

        fetchResults();
    }, [id]);

    const details = (userID) => {
        const data = [];

        // Aggregate
        for (let i = 0; i < questions.length; i++) {
            if (responses[String(i)] && responses[String(i)][userID]) {
                data.push({
                    question: questions[i],
                    response: responses[String(i)][userID],
                });
            }
        }

        setTargetPlayer(data);
        toggleModal();
    };

    return (
        <>
            <UserPopup target={targetPlayer} />

            <motion.div {...fadeIn} className="p-8">
                <div className="bg-base-100 rounded-2xl p-4 max-w-400 m-auto">
                    <h1 className="text-3xl text-center capitalize pt-6 font-bold mb-2">{quizName}</h1>

                    <div className="flex flex-col gap-6 items-center">
                        <h2 className="text-lg font-bold opacity-60">Overall Results</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                            <article className="px-20 py-5 text-center bg-base-300 rounded-lg">
                                <p className="font-bold opacity-60">Total Questions</p>
                                <p className="text-4xl">{questions?.length}</p>
                            </article>

                            <article className="px-20 py-5 text-center bg-base-300 rounded-lg">
                                <p className="font-bold opacity-60">Total Responses</p>
                                <p className="text-4xl">{totalAnswers}</p>
                            </article>

                            <article className="px-20 py-5 text-center bg-base-300 rounded-lg">
                                <p className="font-bold opacity-60">Total Players</p>
                                <p className="text-4xl">{totalPlayers}</p>
                            </article>

                            <article className="px-20 py-5 text-center bg-base-300 rounded-lg">
                                <p className="font-bold opacity-60">Correct</p>
                                <p className="text-4xl">{formatPercent(totalPoints / (maxTotalPoints * totalPlayers))}%</p>
                            </article>
                        </div>

                        <div className="w-full text-center">
                            <h2 className="text-2xl font-bold">Top Players</h2>
                            <h3 className="text-md font-bold mt-4 opacity-60">Top 3 Players</h3>
                        </div>

                        <div className="flex flex-col gap-4 min-[950px]:flex-row min-[950px]:h-56">
                            <div className="order-2 min-[950px]:order-1 sm:self-center">
                                {top3Players[1] && (
                                    <TrophyBox
                                        rank={2}
                                        name={players?.at(1)?.name}
                                        score={`${players?.at(1)?.points}/${maxTotalPoints}`}
                                        percent={formatPercent(players?.at(1)?.points / maxTotalPoints)}
                                    />
                                )}
                            </div>

                            <div className="order-1 min-[950px]:order-1">
                                {top3Players[0] && (
                                    <TrophyBox
                                        rank={1}
                                        name={players?.at(0)?.name}
                                        score={`${players?.at(0)?.points}/${maxTotalPoints}`}
                                        percent={formatPercent(players?.at(0)?.points / maxTotalPoints)}
                                    />
                                )}
                            </div>

                            <div className="order-3 min-[950px]:order-1 sm:self-center">
                                {top3Players[2] && (
                                    <TrophyBox
                                        rank={3}
                                        name={players?.at(2)?.name}
                                        score={`${players?.at(2)?.points}/${maxTotalPoints}`}
                                        percent={formatPercent(players?.at(2)?.points / maxTotalPoints)}
                                    />
                                )}
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold">Leaderboard</h2>

                        <div className="overflow-x-auto w-full">
                            <table className="table-xl w-full max-w-300 m-auto">
                                <thead className="text-left text-lg bg-base-200 rounded-xl">
                                    <tr>
                                        <th>#</th>
                                        <th>Username</th>
                                        <th>Score</th>
                                        <th>Responses</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {players.map((player, index) => (
                                        <tr key={player.id}>
                                            <td className="text-md font-bold">{index + 1}</td>
                                            <td className="text-md">{player.name}</td>
                                            <td className="text-md">
                                                {player.points} / {maxTotalPoints}
                                            </td>
                                            <td className="text-md">{player.responses}x</td>
                                            <td>
                                                <button onClick={() => details(player.id)} className="btn btn-xs btn-primary btn-outline">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
