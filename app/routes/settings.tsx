import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { Glass } from "~/components";
import { Settings } from "~/types";
import { getSettings } from "~/utils/getSettings.server";
import { commitSession, getSession } from "~/utils/sessions.server";

export async function action({request}: ActionFunctionArgs){
    const body = await request.formData();
    const language = String(body.get("language"));
    const isLanguageValid = language === "dk" || language === "en"
    const session = await getSession(request.headers.get("Cookie"));
    session.set("settings", {
        language: isLanguageValid ? language : "en"
    })
    return json(null, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
}

export async function loader({ request }: LoaderFunctionArgs){
    const settings = await getSettings(request.headers.get("Cookie"))
    return settings;
}

export default function SettingsPage() {
    const settings = useLoaderData<typeof loader>();
    const submit = useSubmit();
  
    return (
        <main className="p-6 ">
            <Glass>
                <Form method="post" preventScrollReset replace onChange={e => submit(e.currentTarget)}>
                    <label>
                        <div>Question language</div>
                        <select name="language"
                            defaultValue={settings.language}
                            className="text-black p-1 rounded-sm"
                        >
                            <option value="dk">Dansk</option>
                            <option value="en">English</option>
                        </select>

                    </label>
                </Form>
            </Glass>
        </main>
    )
}
