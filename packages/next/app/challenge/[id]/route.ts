import { getChallengeByID } from "@/lib/challenge/getChallenge";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const challenge = await getChallengeByID(id);
	if (!challenge) {
		return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
	}
	return NextResponse.json({
		id: challenge.id,
		g: challenge.g,
		T: challenge.T,
		N: challenge.N,
	});
}
