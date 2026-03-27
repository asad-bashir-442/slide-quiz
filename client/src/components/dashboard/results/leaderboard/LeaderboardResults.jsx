

export function LeaderboardResults() {
    return(
        <div>
            {/* This Div is the main title/subtitle */}
            <div>
                <h1>Quiz Title</h1>
                <h2>Player Results</h2>
            </div>

            {/* This Div is the leaderboard images/name components*/}
            <div>

            </div>

            {/* This div has the player results*/}
            <div>
                <h2>Leaderboard</h2>

                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Score</th>
                        <th>Responses</th>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    );
}