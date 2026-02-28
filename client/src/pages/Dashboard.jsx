import {DashWelcomePanel} from "../components/dashboard/DashWelcomePanel.jsx";
import {QuizDetailCard} from "../components/dashboard/QuizDetailCard.jsx";

export function Dashboard() {
    return (<div className="flex flex-1 flex-col">
        Dashboard Page
     <DashWelcomePanel/>
        <QuizDetailCard quizName="Example" description="lorem ipsum "
        dateCreated={new Date()} numQuestions="13" />
    </div>);
}