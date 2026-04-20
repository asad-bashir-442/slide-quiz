import { exportResults } from "../../../../api/export";
import { save } from "../../../../utility/save";
import { truncateText } from "../../../../utility/truncate";
import { ago } from "../../../../utility/date";
import { comma } from "../../../../utility/numbers";

import { DeleteResultsButton } from "../buttons/DeleteResultButton";

import { useNavigate } from "react-router";
import { toast } from "sonner";

export function ResultDetailCard({ id, name, lastPlayed, setResponses, mode, numOfQuestion }) {
    const navigate = useNavigate();

    const download = async () => {
        try {
            const results = await exportResults(id);

            save(`SlideQuiz-Results.csv`, [results], { type: "text/csv" });
            toast.success("Results exported successfully!");
        } catch (err) {
            toast.error("Failed to export results!");
            console.error(err);
        }
    };

    return (
        <div className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary max-[900px]:w-full">
            <div className="card-body max-[900px]:text-center">
                <h2 className="min-[900px]:card-title max-[900px]:text-xl font-bold overflow-hidden capitalize" title={name}>
                    {truncateText(name, 25)}
                </h2>
                <h2 className="font-bold mb-4" title={name}>
                    Last Played: <span className="font-normal">{ago(lastPlayed)}</span>
                </h2>

                <div className="status-all min-[900px]:flex justify-between w-full">
                    <div className="min-[900px]:stats shadow bg-base-300 min-[900px]:min-w-[45%] max-[900px]:mb-2">
                        <div className="stat">
                            <div className="stat-title">Questions</div>
                            <div className="stat-value text-2xl">{comma(numOfQuestion)}</div>
                        </div>
                    </div>

                    <div className="min-[900px]:stats shadow bg-base-300 min-[900px]:min-w-[45%] max-[900px]:mb-2">
                        <div className="stat">
                            <div className="stat-title">Type</div>
                            <div className="stat-value text-2xl capitalize">{mode}</div>
                        </div>
                    </div>
                </div>

                <div className="card-actions justify-center flex-nowrap gap-3 mt-4 max-[900px]:flex-wrap max-[900px]:gap-2">
                    <button onClick={() => navigate(`/results/${id}`)} className="btn btn-outline max-[900px]:w-full btn-primary">
                        View Details
                    </button>

                    <button onClick={download} className="btn btn-outline max-[900px]:w-full btn-secondary">
                        Download
                    </button>

                    <DeleteResultsButton setResponses={setResponses} id={id} name={name} />
                </div>
            </div>
        </div>
    );
}
