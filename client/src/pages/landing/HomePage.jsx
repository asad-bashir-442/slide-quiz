import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function HomePage() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    function handleClick() {
        navigate("/join", {
            state: { code },
        });
    }

    useEffect(() => {
        document.title = "SlideQuiz | Home";
    }, []);

    return (
        <div className="w-[80%] mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="md:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-linear-to-r bg-clip-text from-primary to-secondary text-transparent hover:animate-gradient">
                    Present. Ask. Interact.
                </h1>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-base-content/80">Quizzing + Presenting</h2>
                <p className="text-md md:text-lg lg:text-xl text-base-content/70 max-w-2xl">Build questions fast, export them instantly, and keep your audience involved without breaking your flow.</p>

                <div className="w-full max-w-xl space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className="input input-lg flex items-center gap-2 w-full mb-4 border-none">
                            <span className="font-bold text-sm mr-4 opacity-80 select-none">Join Quiz</span>
                            <input value={code} onChange={(e) => setCode(e.target.value)} type="text" className="grow" placeholder="Enter a code" />
                        </label>

                        <button onClick={handleClick} className="btn btn-soft btn-lg sm:w-auto">
                            Join
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register" className="btn btn-outline btn-primary btn-lg flex-1 max-[900px]:py-2">
                            Get Started
                        </Link>

                        <Link to="/about" className="btn btn-outline btn-secondary btn-lg flex-1 max-[900px]:py-2">
                            How to use SlideQuiz?
                        </Link>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex justify-center max-[900px]:hidden">

                <video width="" height="" autoPlay muted playsInline
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl">
                    <source src="output-cropped.webm" type="video/webm" />
                </video>
            </motion.div>

            <div className="col-span-full">
                <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-center my-6 font-bold">
                        SlideQuiz In Action
                    </h2>

                    <div className="divider my-10 max-[900px]:hidden">
                        <span className="opacity-60 text-md italic font-bold">What is SlideQuiz? How does it work?</span>
                    </div>

                    <div className="aspect-video w-full max-w-4xl mx-auto max-[900px]:mt-10">
                        <iframe className="w-full h-full rounded-xl shadow-lg" src="https://www.youtube.com/embed/rRP1v0p7pHM" title="SlideQuiz Demo" allowFullScreen />
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="w-full py-20">
                        <div className="w-[80%] mx-auto text-center max-[900px]:w-[95%]">
                            <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Use SlideQuiz?</h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-6 rounded-xl bg-base-200 shadow hover:border-primary border border-transparent">
                                    <h3 className="text-xl font-semibold">⚡ Fast Creation</h3>
                                    <p>Create quizzes in seconds without slowing down your presentation.</p>
                                </div>

                                <div className="p-6 rounded-xl bg-base-200 shadow hover:border-primary border border-transparent">
                                    <h3 className="text-xl font-semibold">🎯 Engage Audience</h3>
                                    <p>Keep everyone involved with live interaction.</p>
                                </div>

                                <div className="p-6 rounded-xl bg-base-200 shadow hover:border-primary border border-transparent">
                                    <h3 className="text-xl font-semibold">📊 Instant Results</h3>
                                    <p>See responses in real-time and adapt your flow.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="w-full bg-base-200 py-20 rounded-2xl">
                        <div className="w-[80%] mx-auto space-y-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>

                            <div className="grid md:grid-cols-3 gap-10">
                                <div>
                                    <h3 className="text-2xl font-semibold">1. Create</h3>
                                    <p>Build your quiz in seconds.</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold">2. Share</h3>
                                    <p>Send a code to your audience.</p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold">3. Interact</h3>
                                    <p>Watch responses live.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <div className="w-full py-20 text-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">Ready to Try SlideQuiz?</h2>

                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div >
    );
}
