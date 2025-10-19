import { cookies } from "next/headers";
import { getDifficultyData } from "../actions";
import Difficulty from "@/components/Difficulty";
import { verifyAuthToken } from "@shared/auth/jwt";
import { notFound } from "next/navigation";

interface DifficultyPageProps {
	params: Promise<{ siteID?: string[] }>;
}

export default async function DifficultyPage({ params }: DifficultyPageProps) {
	const { siteID } = await params;
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");

	if (!token) {
		return <div>Unauthorized</div>;
	}

	const { payload } = await verifyAuthToken(token.value);
	if (!payload) {
		return <div>Invalid token</div>;
	}

	// Parse siteID from path parameters
	const parsedSiteId = siteID && siteID.length > 0 ? parseInt(siteID[0]) : undefined;

	// Fetch data using Server Action
	const { difficultyConfigs, sites, resources } = await getDifficultyData(payload.userID, parsedSiteId);

	// Filter difficulty configs by site ID if specified
	const filteredDifficultyConfigs = parsedSiteId
		? difficultyConfigs.filter(config => config.siteID === parsedSiteId)
		: difficultyConfigs;

	if (filteredDifficultyConfigs.length === 0) {
		notFound();
	}

	return (
		<div className="container mx-auto py-6">
			<Difficulty
				difficultyConfigs={filteredDifficultyConfigs}
				sites={sites}
				resources={resources}
				selectedSiteId={parsedSiteId}
				userID={payload.userID}
			/>
		</div>
	);
}