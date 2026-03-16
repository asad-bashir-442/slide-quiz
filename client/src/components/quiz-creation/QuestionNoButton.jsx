export function QuestionNoButton({num}){
    return(
        <label className="label">
            <input type="radio" name="radio-1" className="radio radio-xl radio-primary" checked/>
            <span className="label-text">Question #{num}</span>
        </label>
    )
}