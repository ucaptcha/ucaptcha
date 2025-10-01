import { ConfigManager } from "../db";

const DEFAULT_DIFFICULTY = 200000;

export async function getDefaultDifficulty() {
    const data = await ConfigManager.get("default_difficulty");
    if (data) {
        return Number.parseInt(data);
    }
    await ConfigManager.set("default_difficulty", DEFAULT_DIFFICULTY.toString());
    return DEFAULT_DIFFICULTY;
}