import { truncateText } from "../../../../utility/truncate";

// TODO: These need to be implemented
import { ago } from "../../../../utility/date";
import { comma } from "../../../../utility/numbers";

export function ResultDetailCard({
  id,
  name,
  lastPlayed,
  totalResponses,
  averageScore
}) {
  return (
    <div
      className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary cursor-pointer max-[900px]:w-full"
    >
      <div className="card-body max-[900px]:text-center">
        <h2 className="min-[900px]:card-title max-[900px]:text-xl font-bold overflow-hidden" title={name}>{truncateText(name, 25)}</h2>
        <h2 className="font-bold mb-4" title={name}>Last Played: <span className="font-normal">{ago(lastPlayed)}</span></h2>

        <div className="status-all min-[900px]:flex justify-between w-full">
          <div className="min-[900px]:stats shadow bg-base-300 min-[900px]:min-w-[45%] max-[900px]:mb-2">
            <div className="stat">
              <div className="stat-title">Total Respondents</div>
              <div className="stat-value">{comma(totalResponses)}</div>
            </div>
          </div>

          <div className="min-[900px]:stats shadow bg-base-300 min-[900px]:min-w-[45%] max-[900px]:mb-2">
            <div className="stat">
              <div className="stat-title">Average</div>
              <div className="stat-value">{(averageScore * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* TODO: Should implement these too */}
        <div className="card-actions justify-center flex-nowrap gap-3 mt-4 max-[900px]:flex-wrap max-[900px]:gap-2">
          <button className="btn btn-outline max-[900px]:w-full btn-primary">View Details</button>
          <button className="btn btn-outline max-[900px]:w-full btn-secondary">Download</button>
          <button className="btn btn-outline max-[900px]:w-full btn-error">Delete</button>
        </div>
      </div>
    </div>
  );
}

