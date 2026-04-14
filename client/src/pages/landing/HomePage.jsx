import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";

export function HomePage() {
  const [code, setCode] = useState("");
  let navigate = useNavigate();
  function handleClick() {
    navigate("/join", {
      state: { code },
    });
  }

  return (
    <div className="w-[80%] mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
      {/* Content Column */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Present. Ask. Interact.
        </h1>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-base-content/80">
          Quizzing + Presenting
        </h2>

        <p className="text-md md:text-lg lg:text-xl text-base-content/70 max-w-2xl">
          Build questions fast, export them instantly, and keep your audience
          involved without breaking your flow.
        </p>

        {/* Container for input + buttons */}
        <div className="w-full max-w-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="input input-lg flex items-center gap-2 w-full">
              <span>Join Quiz</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="text"
                className="grow"
                placeholder="Enter a code"
              />
            </label>

            <button
              onClick={handleClick}
              className="btn btn-soft btn-lg sm:w-auto"
            >
              Join
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="btn btn-outline btn-primary btn-lg flex-1"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="btn btn-outline btn-secondary btn-lg flex-1"
            >
              How to use SlideQuiz?
            </Link>
          </div>
        </div>
      </div>
      {/* Image Column */}
      <div className="flex justify-center">
        <img
          src="/images/preview.png"
          alt="Smartphone with a preview of the SlideQuiz Application"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg"
        />
      </div>

      <div className="col-span-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-center mb-2">
          SlideQuiz In Action
        </h2>
        <div className="aspect-video w-full max-w-4xl mx-auto">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/rRP1v0p7pHM"
            title="SlideQuiz Demo"
            allowFullScreen
          />
        </div>

        <div className="w-full py-20">
          <div className="w-[80%] mx-auto text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Use SlideQuiz?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-base-200 shadow">
                <h3 className="text-xl font-semibold">⚡ Fast Creation</h3>
                <p>
                  Create quizzes in seconds without slowing down your
                  presentation.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-base-200 shadow">
                <h3 className="text-xl font-semibold">🎯 Engage Audience</h3>
                <p>Keep everyone involved with live interaction.</p>
              </div>

              <div className="p-6 rounded-xl bg-base-200 shadow">
                <h3 className="text-xl font-semibold">📊 Instant Results</h3>
                <p>See responses in real-time and adapt your flow.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-base-200 py-20">
          <div className="w-[80%] mx-auto space-y-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xl font-semibold">1. Create</h3>
                <p>Build your quiz in seconds.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">2. Share</h3>
                <p>Send a code to your audience.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">3. Interact</h3>
                <p>Watch responses live.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-20 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Try SlideQuiz?
            </h2>

            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
