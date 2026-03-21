export function HomePage() {
  return (<div>
      <div>
          <h1><b>Present. Ask. Interact.</b></h1>
          <h1>Quizzing + Presenting</h1>

          <h3>Build questions fast, export them instantly,
              and keep your audience involved without breaking your flow.</h3>

            <div>
              <label className="input">
                  Join Quiz
                  <input type="text" className="grow input-lg" placeholder="Enter a code" />

              </label>
              <button className="btn btn-soft btn-lg">Join</button>
            </div>

          <div>
              <button className="btn btn-outline btn-primary btn-xl">Get Started</button>
              <button className="btn btn-outline btn-secondary btn-xl">How to use SlideQuiz?</button>
          </div>

      </div>

    <div><img src="/images/preview.png" alt="Smartphone with a preview of the SlideQuiz Application" /></div>
  </div>);
}
