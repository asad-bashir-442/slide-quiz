import { TrophyBox } from "./TrophyBox.jsx";

export function LeaderboardResults() {
    {/* This is just dummy data for now*/}
    const players = [
        { id: 1, name: "Bob", score: "13/14", responses: 14 },
        { id: 2, name: "Stuart", score: "12/14", responses: 14 },
        { id: 3, name: "Kevin", score: "11/14", responses: 14 },
        { id: 4, name: "Alice", score: "10/14", responses: 14 },
        { id: 5, name: "John", score: "9/14", responses: 14 },
    ];
    return (
        <div className="w-11/12 max-w-5xl mx-auto py-8">

            {/* Title / Subtitle */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Quiz Title
                </h1>
                <h2 className="text-lg md:text-xl italic text-base-content/70 mt-2">
                    Player Results
                </h2>
            </div>

            {/* Podium */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 mb-12">

                {/* 2nd Place */}
                <div className="order-2 md:order-1 md:mb-6">
                    <TrophyBox
                        rank={2}
                        name="Stuart"
                        score="12/14"
                        percent={80}
                    />
                </div>

                {/* 1st Place (center, higher) */}
                <div className="order-1 md:order-2 md:mb-16 scale-105">
                    <TrophyBox
                        rank={1}
                        name="Bob"
                        score="13/14"
                        percent={90}
                    />
                </div>

                {/* 3rd Place */}
                <div className="order-3 md:order-3 md:mb-2">
                    <TrophyBox
                        rank={3}
                        name="Kevin"
                        score="11/14"
                        percent={70}
                    />
                </div>

            </div>

            {/* Table Section */}
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Leaderboard
                </h2>

                <div className="overflow-x-auto flex justify-center">
                    <table className="table w-full max-w-3xl">
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
                            <tr key={player.id} className="hover">
                                <th>{index + 1}</th>
                                <td>{player.name}</td>
                                <td>{player.score}</td>
                                <td>{player.responses}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}