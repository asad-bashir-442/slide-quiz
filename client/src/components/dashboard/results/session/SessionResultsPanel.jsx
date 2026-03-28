// import {useEffect, useState} from "react";
// import {useParams} from "react-router";
// import {getQuizById} from "../../../../api/quiz.js";
// import {getAllQuestionsById} from "../../../../api/editor.js";

export function SessionResultsPanel() {
    // const [session, setSession] = useState(null);
    // const [severError, setServerError] = useState(null);
    // let { id } = useParams();
    //
    // useEffect(() => {
    //     const fetchResults = async () => {
    //         try {
    //             const sessionData = await getResultsById(id);
    //             const fullQuizData = {
    //                 ...sessionData.data,
    //                 ...sessionData.data,
    //             };
    //
    //             setSession(fullQuizData);
    //
    //             console.dir(fullQuizData);
    //         } catch (error) {
    //             setServerError(error.message);
    //         }
    //     };
    //
    //     fetchResults();
    // }, [id]);

    // if (severError) {
    //     return (
    //         <div className="flex flex-1 flex-col justify-center items-center">
    //             <h1 className="text-6xl">404</h1>
    //             <p>Quiz Not Found</p>
    //         </div>
    //     );
    // }

    {/* This is just dummy data for now*/}
    const players = [
        { id: 1, name: "Bob", score: "13/14", responses: 14 },
        { id: 2, name: "Stuart", score: "12/14", responses: 14 },
        { id: 3, name: "Kevin", score: "11/14", responses: 14 },
        { id: 4, name: "Alice", score: "10/14", responses: 14 },
        { id: 5, name: "John", score: "9/14", responses: 14 },
    ];

        return (
            <dialog className="modal">
                <div className="modal-box w-11/12 max-w-5xl">

                    {/* Title Bar */}
                    <div className="mb-6 text-left">
                        <h1 className="text-3xl font-bold">Quiz Title</h1>
                        <h4 className="text-sm opacity-70">Completed: x Days Ago</h4>
                    </div>

                    {/* Quick Stats */}
                    <div className="mb-8">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-semibold">Overall Statistics</h2>
                            <h3 className="text-sm opacity-70">Details Below</h3>
                        </div>

                        <div className="stats stats-vertical md:stats-horizontal shadow w-full">
                            <div className="stat place-items-center">
                                <div className="stat-title">Total Questions</div>
                                <div className="stat-value">XX</div>
                            </div>

                            <div className="stat place-items-center">
                                <div className="stat-title">Total Answers</div>
                                <div className="stat-value">XXX</div>
                            </div>

                            <div className="stat place-items-center">
                                <div className="stat-title">% Correct</div>
                                <div className="stat-value">XX%</div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
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

                    {/* Close Button */}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>

                </div>
            </dialog>
        );

}