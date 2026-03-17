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
      className="card w-96 bg-base-100 border border-transparent shadow-sm transition duration-200 ease-in-out hover:border-primary cursor-pointer"
    >
      <div className="card-body">
        <h2 className="card-title" title={name}>{truncateText(name, 25)}</h2>

        <div className="flex gap-2 mt-2">
          <div className="badge badge-ghost">Created on: {ago(lastPlayed)}</div>
        </div>

        <div className="status-all flex justify-between w-full">
            <div className="stats shadow bg-base-300 min-w-[45%]">
              <div className="stat">
                <div className="stat-title">Total Respondents</div>
                <div className="stat-value">{comma(totalResponses)}</div>
              </div>
            </div>

            <div className="stats shadow bg-base-300 min-w-[45%]">
              <div className="stat">
                <div className="stat-title">Average</div>
                <div className="stat-value">{(averageScore * 100).toFixed(0)}%</div>
              </div>
            </div>
        </div>

        {/* TODO: Should implement these too */}
        <div className="card-actions justify-center flex-nowrap gap-3 mt-4">
          <button className="btn btn-outline btn-primary">View Details</button>
          <button className="btn btn-outline btn-secondary">Download</button>
          <button className="btn btn-outline btn-error">Delete</button>
        </div>
      </div>
    </div>
  );
}

