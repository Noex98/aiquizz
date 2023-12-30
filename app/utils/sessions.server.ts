import { createCookieSessionStorage, createCookie } from "@remix-run/node";
import { Quizz, Settings } from "~/types";

export const sessionCookie = createCookie("__session", {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secrets: [process.env["COOKIE_SECRET"]],
});

type SessionData = {
  quizz?: Quizz
  settings?: Settings
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({ cookie: sessionCookie });

export { getSession, commitSession, destroySession };
