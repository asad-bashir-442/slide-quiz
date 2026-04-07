import { useParams } from "react-router";
import { getReponseById } from "../api/responses";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { TrophyBox } from "../components/dashboard/results/leaderboard/TrophyBox";

export function ResultsPage() {
  const [questions, setQuestions] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [quizName, setQuizName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxTotalPoints, setMaxTotalPoints] = useState(0);
  const [top3Players, setTop3Players] = useState(0);

  const [players, setPlayers] = useState([]);

  function formatPercent(decimal) {
    if (!decimal || !isFinite(decimal)) return 0;
    return Number((decimal * 100).toFixed(2));
  }

  let { id } = useParams();

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getReponseById(id);
        const playersMap = new Map();

        const name = data?.data?.questions.name;
        const questions = data?.data?.questions?.questions;
        const responses = data?.data?.responses;

        let maxPoints = 0;

        data?.data?.questions?.questions.forEach((question) => {
          maxPoints += question.points;
        });

        Object.keys(responses).forEach((questionKey) => {
          const questionResponses = responses[questionKey];

          Object.values(questionResponses).forEach((playerResponse) => {
            const username = playerResponse.username;

            if (!playersMap.has(username)) {
              playersMap.set(username, {
                points: 0,
                responses: 0,
                name: username,
              });
            }

            const player = playersMap.get(username);

            player.responses += 1;

            if (playerResponse.response.correct === 1) {
              const questionIndex = Number(questionKey);
              player.points += questions[questionIndex]?.points || 0;
            }
          });
        });

        const sortedPlayers = [...playersMap.values()].toSorted(
          (a, b) => b.points - a.points,
        );

        let totalPlayerPoints = 0;
        sortedPlayers.forEach((player) => {
          totalPlayerPoints += player.points;
        });

        const tempTop3Players = sortedPlayers.slice(0, 3);

        setQuestions(questions);
        setQuizName(name);
        setMaxTotalPoints(maxPoints);
        setTotalPoints(totalPlayerPoints);
        setPlayers(sortedPlayers);
        setTotalPlayers(playersMap.size);
        setTop3Players(tempTop3Players);
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
    fetchResults();
  }, [id]);

  return (
    <div className="p-8">
      <div className="bg-base-100 rounded-2xl">
        <h1 className="text-5xl text-center capitalize pt-6 font-bold mb-2">
          {quizName}
        </h1>

        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-3xl italic">Player Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <article className="p-20 text-center bg-base-300 rounded-lg">
              <p>Total Questions</p>
              <p className="text-4xl">{questions?.length}</p>
            </article>
            <article className="p-20 bg-base-300 rounded-lg">
              <p>Total Answers</p>
            </article>
            <article className="p-20 text-center bg-base-300 rounded-lg">
              <p>Total Players</p>
              <p className="text-4xl">{totalPlayers}</p>
            </article>
            <article className="p-20 text-center bg-base-300 rounded-lg">
              <p>Correct</p>
              <p className="text-4xl">
                {formatPercent(totalPoints / (maxTotalPoints * totalPlayers))}%
              </p>
            </article>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:h-56">
            <div className="order-2 sm:order-1 sm:self-center">
              {top3Players[1] && (
                <TrophyBox
                  rank={2}
                  name={players?.at(1)?.name}
                  score={`${players?.at(1)?.points}/${maxTotalPoints}`}
                  percent={formatPercent(
                    players?.at(1)?.points / maxTotalPoints,
                  )}
                />
              )}
            </div>

            <div className="order-1 sm:order-1">
              {top3Players[0] && (
                <TrophyBox
                  rank={1}
                  name={players?.at(0)?.name}
                  score={`${players?.at(0)?.points}/${maxTotalPoints}`}
                  percent={formatPercent(
                    players?.at(0)?.points / maxTotalPoints,
                  )}
                />
              )}
            </div>

            <div className="order-3 sm:order-1 sm:self-center">
              {top3Players[2] && (
                <TrophyBox
                  rank={3}
                  name={players?.at(2)?.name}
                  score={`${players?.at(2)?.points}/${maxTotalPoints}`}
                  percent={formatPercent(
                    players?.at(2)?.points / maxTotalPoints,
                  )}
                />
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold">Leaderboard</h2>

          <div className="overflow-x-auto">
            <table className="table-xl m-4">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Responses</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.name}>
                    <td>{index + 1}</td>
                    <td className="text-center"> {player.name}</td>
                    <td className="text-center">
                      {player.points} / {maxTotalPoints}
                    </td>
                    <td className="text-center">{player.responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
