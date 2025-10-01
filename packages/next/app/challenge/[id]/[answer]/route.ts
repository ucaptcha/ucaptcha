import { getChallengeByID } from "@/lib/challenge/getChallenge";
import { verifyVDF } from "@core/index";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	let res;
	try {
		res = await request.json();
	} catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
	const challenge = await getChallengeByID(id);
	if (!challenge) {
		return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
	}
	if (!res || res.answer) {
		return NextResponse.json(
			{ error: "Missing property 'answer' in request body" },
			{ status: 400 },
		);
	}
    const answer = res.answer;
    const correct = verifyVDF(
        BigInt(challenge.g),
        BigInt(challenge.N),
        BigInt(challenge.T),
        BigInt(answer),
        BigInt(challenge.p),
        BigInt(challenge.q),
    );
    if (!correct) {
        return NextResponse.json({ error: "Incorrect answer" }, { status: 400 });
    }
}
