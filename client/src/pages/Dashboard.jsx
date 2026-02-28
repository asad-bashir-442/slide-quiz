import {DashWelcomePanel} from "../components/dashboard/DashWelcomePanel.jsx";


export function Dashboard() {
    return (
        <div className="flex flex-col">


     <DashWelcomePanel username={"User"}/>
        {/*<QuizDetailCard quizName="Example" description="lorem ipsum "*/}
        {/*                dateCreated={new Date()} numQuestions="13" />*/}
    </div>
    )
}