import { Typography } from "@/components/ui/typography";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { getUserQuota } from "@db/quota";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@shared/auth/jwt";
import { Quota } from "@/components/Dashboard";
import {
	getSolvedChallengesInLastMonthByUser,
	getChallengesGeneratedInLastMonthByUser
} from "@db/challenges/stats";
import { settingsManager } from "@db/settings";

export default async function Home() {
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token")!.value;
	const { payload } = await verifyAuthToken(authToken!);
	const hasQuota = (await settingsManager.get("monthlyQuota")) > 0;
	const quota = await getUserQuota(payload?.userID!, false);
	const solved = await getSolvedChallengesInLastMonthByUser(payload?.userID!);
	const generated = await getChallengesGeneratedInLastMonthByUser(payload?.userID!);

	return (
		<div className="font-sans">
			<Typography.H1 className="mt-4 ml-1">Dashboard</Typography.H1>
			<div className="mt-4 grid grid-cols-1 max-lg:gap-6 xl:grid-cols-2 gap-6">
				{hasQuota && <Quota quota={quota} uid={payload?.userID!} />}
				<div className="grid sm:grid-cols-2 gap-6">
					<Card className="gap-3">
						<CardHeader>
							<CardDescription>Challenges Solved</CardDescription>
							<CardTitle className="text-2xl tabular-nums">
								{solved.toLocaleString("en-US")}
							</CardTitle>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="text-muted-foreground">
								The challenges that have been correctly solve in the past 30 days.
							</div>
						</CardFooter>
					</Card>
					<Card className="gap-3">
						<CardHeader>
							<CardDescription>Challenges Generated</CardDescription>
							<CardTitle className="text-2xl tabular-nums">
								{generated.toLocaleString("en-US")}
							</CardTitle>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="text-muted-foreground">
								The challenges generated in the past 30 days.
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
