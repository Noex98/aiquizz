import { Settings } from "~/types";
import { getSession } from "./sessions.server";

const defaultSettings: Settings = {
    language: "en"
  }

export const getSettings = async (cookie: string | null) => {
    const session = await getSession(cookie);
    return session.get("settings") ?? defaultSettings;
}