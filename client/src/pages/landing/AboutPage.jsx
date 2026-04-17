import { fadeIn } from "../../utility/animation";

import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Apple, Smartphone, CircleQuestionMark, Download, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
    useEffect(() => {
        document.title = "SlideQuiz | About";
    });

    const [tab, setTab] = useState(true);

    const scroll = (id) => {
        const el = document.getElementById(`about-${id}`);
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <motion.div {...fadeIn} className="w-[80%] mx-auto my-10 max-w-250 max-sm:w-[95%]">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                <h2 className="font-bold text-4xl md:text-5xl w-full">
                    <span className="opacity-60">What is </span>

                    <span>
                        <span>Slide</span>
                        <span className="text-primary">Quiz</span>
                    </span>

                    <span className="opacity-60">?</span>
                </h2>

                <h4 className="mb-2 mt-4 font-bold text-lg opacity-60 text-secondary">Click the navigation to jump to a section!</h4>

                <p className="py-4 md:text-lg opacity-60">
                    Slide<span className="text-primary">Quiz</span> is a web application designed to simplify the process of creating and hosting quizzes during live presentations. It provides tools
                    that allow instructors and presenters to insert questions directly into their slides, enabling real-time participation from students or audiences.
                </p>

                <div className="flex max-sm:justify-center">
                    <ul className="menu menu-horizontal bg-base-200 rounded-box">
                        <li onClick={() => scroll("how-to")}>
                            <a className="flex">
                                <CircleQuestionMark />
                                <span className="w-full font-bold max-[1100px]:hidden">
                                    <span className="opacity-60">How to use</span> Slide<span className="text-primary">Quiz</span>
                                    <span className="opacity-60">?</span>
                                </span>
                            </a>
                        </li>

                        <li onClick={() => scroll("install")}>
                            <a className="flex">
                                <Download />
                                <span className="w-full font-bold max-[1100px]:hidden">
                                    <span className="opacity-60">Installing</span> Slide<span className="text-primary">Quiz</span>
                                </span>
                            </a>
                        </li>

                        <li onClick={() => scroll("more")}>
                            <a className="flex">
                                <BookOpen />
                                <span className="w-full font-bold max-[1100px]:hidden opacity-60">Additional Information</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="my-10 divider"></motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-base-100 rounded-lg p-4 my-8 shadow-lg m-auto"
                id="about-how-to"
            >
                <div className="flex justify-center mt-4">
                    <CircleQuestionMark className="mt-1 mr-4 max-[600px]:hidden" />
                    <h2 className="text-2xl font-bold max-sm:text-lg">
                        How to use Slide<span className="text-primary">Quiz</span>?
                    </h2>
                </div>

                <div className="flex my-8 gap-4 max-[900px]:flex-col">
                    <div className="flex flex-col gap-4 justify-center w-full order-2">
                        <div className="bg-base-300 rounded-lg shadow-lg p-4">
                            <h2 className="font-bold text-lg text-secondary">Step 1.</h2>
                            <p>
                                Create an account and visit the{" "}
                                <Link className="text-primary hover:underline" to="/dashboard">
                                    Dashboard
                                </Link>
                                .
                            </p>
                        </div>

                        <div className="bg-base-300 rounded-lg shadow-lg p-4">
                            <h2 className="font-bold text-lg text-secondary">Step 2.</h2>
                            <p>
                                Create your first quiz and choose between <span className="text-secondary">automatic</span> and <span className="text-secondary">manual</span> mode.
                            </p>
                        </div>

                        <div className="bg-base-300 rounded-lg shadow-lg p-4">
                            <h2 className="font-bold text-lg text-secondary">Step 3.</h2>
                            <p>
                                Head back to the{" "}
                                <Link className="text-primary hover:underline" to="/dashboard">
                                    Dashboard
                                </Link>{" "}
                                and click <span className="text-secondary">host</span> on the newly created quiz.
                            </p>
                        </div>
                    </div>

                    <div className="order-1 bg-base-300 rounded-lg shadow-lg p-4 text-center w-[40%] min-[900px]:min-w-[250px] max-[900px]:order-2 max-[900px]:w-full">
                        <h2 className="font-bold text-lg">Automatic vs Manual Mode</h2>

                        <div className="text-sm p-2 opacity-60">
                            <p>
                                In <span className="italic font-bold">manual</span> mode, the host decides when each question appears, and all users see the same question at the same time. Ideal for
                                presentations.
                            </p>

                            <div className="divider"></div>

                            <p>
                                In <span className="italic font-bold">automatic</span> mode, questions advance as each user answers, so players may be on different questions.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-base-100 rounded-lg p-4 my-8 shadow-lg m-auto"
                id="about-install"
            >
                <div className="flex justify-center mt-4">
                    <Download className="mt-1 mr-4 max-[600px]:hidden" />
                    <h2 className="text-2xl font-bold max-sm:text-lg">
                        Installing Slide<span className="text-primary">Quiz</span>
                    </h2>
                </div>

                <div className="mt-8 text-center">
                    <div role="tablist" className="tabs tabs-box inline-block">
                        <a className={`tab [--tab-bg:theme(colors.primary)] ${tab && "tab-active"}`} onClick={() => setTab(true)}>
                            <Apple className="mr-2" />
                            <span>iOS Install</span>
                        </a>

                        <a className={`tab [--tab-bg:theme(colors.primary)] ${!tab && "tab-active"}`} onClick={() => setTab(false)}>
                            <Smartphone className="mr-2" />
                            <span>Android Install</span>
                        </a>
                    </div>

                    <div className="aspect-video w-full max-w-4xl max-h-[250px] my-8 mx-auto max-[900px]:mt-10">
                        {/* TODO: Replace with iOS video */}
                        <iframe
                            className={`w-[450px] h-[250px] max-sm:w-full rounded-xl shadow-lg m-auto border border-transparent ${!tab && "hidden"}`}
                            src="https://www.youtube.com/embed/rRP1v0p7pHM"
                            title="SlideQuiz iOS Install"
                            allowFullScreen
                        />

                        {/* TODO: Replace with Android video */}
                        <iframe
                            className={`w-[450px] h-[250px] max-sm:w-full rounded-xl shadow-lg m-auto border border-transparent ${tab && "hidden"}`}
                            src="https://www.youtube.com/embed/rRP1v0p7pHM"
                            title="SlideQuiz Android Install"
                            allowFullScreen
                        />
                    </div>

                    <p className="mb-8 opacity-60 font-bold">
                        For convenience, Slide<span className="text-primary">Quiz</span> can be installed as a webapp on both iOS and Android.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-base-100 rounded-lg p-4 my-8 shadow-lg m-auto"
                id="about-more"
            >
                <div className="flex justify-center mt-4">
                    <BookOpen className="mt-1 mr-4 max-[600px]:hidden" />
                    <h2 className="text-2xl font-bold max-sm:text-lg">Additional Information</h2>
                </div>

                <div className="flex justify-center gap-4 my-8">
                    <a href="https://github.com/asad-bashir-442/slide-quiz" target="_blank" className="inline-block hover:opacity-60">
                        <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-base w-[3em] h-[3em]">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </a>

                    <a href="https://www.youtube.com/channel/UCYYTfG2RMprBNseRs_zLBvw" target="_blank" className="inline-block hover:opacity-60">
                        <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-base w-[3em] h-[3em]">
                            <title>YouTube</title>
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                </div>

                <p className="mb-8 opacity-60 font-bold text-center">&copy; SlideQuiz {new Date().getFullYear()} - Interactive Quizzing Platform</p>
            </motion.div>
        </motion.div>
    );
}
