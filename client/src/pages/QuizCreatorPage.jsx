export function QuizCreatorPage() {
    const date = new Date();
    const time = date.getTime();
    return (
        <div>
        <div className="title">
        <h1>Quiz Title</h1>
        <h2>Saved - {{time}}</h2>
        </div>

        <div>
            <h2>question list</h2>
        </div>

        <div>
            <h2>editor list</h2>
        </div>
        </div>
    )
}