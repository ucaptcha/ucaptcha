import { cookies } from "next/headers";
import { getResourcesData } from "../actions";
import Resources from "@/components/Resources";
import { verifyAuthToken } from "@shared/auth/jwt";

interface ResourcesPageProps {
	params: Promise<{ siteID?: string[] }>;
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
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
	const { resources, sites } = await getResourcesData(payload.userID, parsedSiteId);

	// Filter resources by site ID if specified
	const filteredResources = parsedSiteId
		? resources.filter(resource => resource.siteID === parsedSiteId)
		: resources;

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Resources</h1>
			</div>
			
			<Resources
				resources={filteredResources}
				sites={sites}
				selectedSiteId={parsedSiteId}
				userID={payload.userID}
			/>
		</div>
	);
}
