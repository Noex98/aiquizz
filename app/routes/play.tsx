import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react"
import { useState } from "react";
import { Glass, Button } from "~/components";
import { Quizz } from "~/types";
import { getSession } from "~/utils/sessions.server";

export async function loader({ request }: LoaderFunctionArgs){
    const session = await getSession(request.headers.get("Cookie"))
    const quizz = session.get("quizz");
    if (!quizz) throw redirect('/');
    return quizz;
}

export default function play() {
    //TODO fix quizz.quizz
    const { quizz } = useLoaderData<{quizz: Quizz}>();
    const [revealedAnswers, setRevealedAnswers] = useState<number[]>([])
    return (
        <main>
            <div className="flex snap-x snap-mandatory overflow-x-scroll w-full">
                {quizz.map((question, index) => (
                    <div key={index} className=" flex flex-col gap-3 justify-center snap-center flex-shrink-0 w-[100vw] p-6">
                        <Glass> 
                            <div>{question.question}</div>
                        </Glass>
                            {revealedAnswers.includes(index) && (
                                <Glass>
                                    <div>Answer:</div>
                                    <div>
                                        {question.correctAnswer}
                                    </div>
                                </Glass>
                            )}
                            {!revealedAnswers.includes(index) && (
                                <Button
                                    onClick={() => setRevealedAnswers(prev => [...prev, index])}
                                >Reveal answer
                                </Button>
                            )}
                    </div>
                ))}
                <div className="snap-center flex-shrink-0 w-[100vw] p-6">
                    <Glass>
                        <Link to={"/"}>
                            <Button>Go back</Button>
                        </Link>
                    </Glass>
                </div>
            </div>

        </main>
    )
}
