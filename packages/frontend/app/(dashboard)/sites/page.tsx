import { cookies } from "next/headers";
import { getSitesData } from "./actions";
import Sites from "@/components/Sites";
import { verifyAuthToken } from "@shared/auth/jwt";

export default async function SitesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");

	if (!token) {
		return <div>Unauthorized</div>;
	}

	const { payload } = await verifyAuthToken(token.value);
	if (!payload) {
		return <div>Invalid token</div>;
	}

	const { sites } = await getSitesData(payload.userID);

	return (
		<div className="container mx-auto py-6">
			<Sites initialSites={sites} userID={payload.userID} />
		</div>
	);
}
