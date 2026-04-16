export function QuestionNoButton({ num, id }) {
    return (
        <label
            onClick={() => {
                const el = document.getElementById(`question_linkto_${id}`);

                if (el) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }}
            className="label w-fit"
        >
            <input type="radio" name="radio-1" className="radio radio-xl radio-primary" checked />
            <span className="label-text">Question #{num}</span>
        </label>
    );
}
