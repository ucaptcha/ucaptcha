import { cookies } from "next/headers";
import { getResourcesData } from "./actions";
import Resources from "@/components/Resources";
import { verifyAuthToken } from "@shared/auth/jwt";

export default async function ResourcesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");

	if (!token) {
		return <div>Unauthorized</div>;
	}

	const { payload } = await verifyAuthToken(token.value);
	if (!payload) {
		return <div>Invalid token</div>;
	}

	const { resources, sites } = await getResourcesData(payload.userID);

	return (
		<div className="container mx-auto py-6">
			<Resources
				resources={resources}
				sites={sites}
				selectedSiteId={undefined}
				userID={payload.userID}
			/>
		</div>
	);
}
