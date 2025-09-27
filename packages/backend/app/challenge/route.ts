import { getDefaultDifficulty } from "@/lib/challenge/difficulty";
import { generateChallenge } from "@/lib/challenge/getChallenge";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const res = await request.json();
    const requestedDifficulty = res.difficulty;
    const difficulty = requestedDifficulty || (await getDefaultDifficulty());
    const challenge = await generateChallenge(difficulty);
    if (!challenge) {
        return NextResponse.json({ error: "No challenge available" }, { status: 500 });
    }
    return NextResponse.json({
        id: challenge.id,
        g: challenge.g,
        T: challenge.T,
        N: challenge.N
    });
}
