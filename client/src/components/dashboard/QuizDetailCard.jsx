export function QuizDetailCard({quizName, description, dateCreated, numQuestions}){
    return (
        <div className="card w-96 bg-base-100 card-md shadow-sm">
            <div className="card-body">
                <h2 className="card-title">{quizName}</h2>
                <p>{description}<br/>
                s
                    <div className="badge badge-ghost">Created on: {dateCreated}</div>
                    <div className="badge badge-ghost">{numQuestions} questions</div>
                </p>

                <div className="justify-end card-actions">
                    <button className="btn btn-primary">Edit Quiz</button>
                    <button className="btn btn-secondary">Download</button>
                    <button className="btn btn-accent">Host</button>
                    <button className="btn btn-error">Delete</button>
                </div>
            </div>
        </div>
    )
}