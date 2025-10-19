import { cookies } from "next/headers";
import { getDifficultyData } from "./actions";
import Difficulty from "@/components/Difficulty";
import { verifyAuthToken } from "@shared/auth/jwt";

export default async function DifficultyPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");

	if (!token) {
		return <div>Unauthorized</div>;
	}

	const { payload } = await verifyAuthToken(token.value);
	if (!payload) {
		return <div>Invalid token</div>;
	}

	const { difficultyConfigs, sites, resources } = await getDifficultyData(payload.userID);

	return (
		<div className="container mx-auto py-6">
			<Difficulty
				difficultyConfigs={difficultyConfigs}
				sites={sites}
				resources={resources}
				selectedSiteId={undefined}
				userID={payload.userID}
			/>
		</div>
	);
}