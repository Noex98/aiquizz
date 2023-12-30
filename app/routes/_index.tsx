import { redirect, type ActionFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import OpenAI from "openai";
import { getSession, commitSession } from "~/utils/sessions.server";
import { Glass, Spinner } from "~/components";
import { useState } from "react";
import { Button } from "~/components/Button";
import { TextInput } from "~/components/TextInput";
import { Language } from "~/types";
import { getSettings } from "~/utils/getSettings.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Quizz app" },
  ];
};

const createPrompt = (topic: string, difficulty: string, language: Language ) => {
    return `
        Give me a 6 question quizz about "${topic}".
        The difficulty must be a ${difficulty} out of 10.
        You MUST answer with valid JSON in the following structure:
        type quizz = [
            {
                question: string,
                correctAnswer: string
            }
        ]
        ${language === "dk" ? "The data iteself MUST be written in Danish" : ""}
    `
}

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();
    const topic = String(body.get("topic"));
    const difficulty = String(body.get("difficulty"));
    
    if(!topic || !difficulty) return null;

    const session = await getSession(request.headers.get("Cookie"));
    const { language } = await getSettings(request.headers.get("Cookie"))
    
    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']
    });

    const completion = await openai.chat.completions.create({
        messages: [{ 
            role: 'user', 
            content: createPrompt(topic, difficulty, language)
        }],
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: "json_object" },
    });

    if( !completion.choices[0].message.content ) return null;

    const quizz = await JSON.parse(completion.choices[0].message.content);
    session.set("quizz", quizz)
    
    return redirect("/play", {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}

export default function Index() {
    const { state } = useNavigation();
    const [difficulty, setDifficulty] = useState("5")

    if(state == "idle"){
        return (
            <main className="flex justify-center content-center">
                <Spinner />
            </main>
        )
    }

    return (
        <main className="h-screen flex justify-center">
            <div>
                <Glass>
                    <Form method="post" className="h-auto flex flex-col gap-6">
                        <label>
                            <div>Topic:</div>
                            <TextInput required name="topic" />
                        </label>
                        <label>
                            <div>Difficulty:</div>
                            <div className="flex">
                                <input
                                    className="grow accent-white"
                                    type="range"
                                    name="difficulty"
                                    min={1}
                                    max={10}
                                    value={difficulty}
                                    onChange={e => setDifficulty(e.target.value)}
                                />
                                <span className="pl-3">{difficulty}</span>
                            </div>
                        </label>
                        <Button type="submit">Play</Button>
                    </Form>
                </Glass>
            </div>
            
        </main>
    )
}
