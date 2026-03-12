import { DashWelcomePanel } from "../components/dashboard/DashWelcomePanel.jsx";
import { QuizDetailCard } from "../components/dashboard/QuizDetailCard.jsx";
import { QuizDetailPopup } from "../components/dashboard/QuizDetailPopup.jsx";

export function Dashboard() {
  return (
    <div className="flex flex-col">
      {/*<button*/}
      {/*    className="btn btn-primary"*/}
      {/*    onClick={() => document.getElementById("edit_quiz_modal").showModal()}*/}
      {/*>*/}
      {/*    View Quiz*/}
      {/*</button>*/}

      {/*<QuizDetailPopup*/}
      {/*    modalId="edit_quiz_modal"*/}
      {/*    quizName="History Quiz"*/}
      {/*    dateCreated="2026-03-01"*/}
      {/*    dateModified="2026-03-05"*/}
      {/*/>*/}
      <DashWelcomePanel />
      <QuizDetailCard
        quizName="Example"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut condimentum eget ante a fermentum. Nulla facilisi. Quisque rhoncus gravida leo, eu tincidunt elit vestibulum et. Phasellus orci eros, varius vitae sem luctus, eleifend pulvinar mi"
        dateCreated={new Date()}
        numQuestions="13"
      />
    </div>
  );
}
