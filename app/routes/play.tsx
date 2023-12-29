import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react"
import { getSession } from "~/utils/sessions.server";

export async function loader({ request }: LoaderFunctionArgs){
    const session = await getSession(request.headers.get("Cookie"))
    return await session.get("quizz");
}

export default function play() {
    const quizz = useLoaderData();
    console.log(quizz)

    return (
        <div>play</div>
    )
}
