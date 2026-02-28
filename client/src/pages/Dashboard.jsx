import {DashWelcomePanel} from "../components/dashboard/DashWelcomePanel.jsx";
import {QuizDetailCard} from "../components/dashboard/QuizDetailCard.jsx";

export function Dashboard() {
    return (
        <div className="flex flex-col">


     <DashWelcomePanel username={"User"}/>
        {/*<QuizDetailCard quizName="Example" description="lorem ipsum "*/}
        {/*                dateCreated={new Date()} numQuestions="13" />*/}
    </div>
    )
}