import { cookies } from "next/headers";
import { getAccountData } from "./actions";
import Account from "@/components/Account";
import { verifyAuthToken } from "@shared/auth/jwt";

export default async function AccountPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");

	if (!token) {
		return <div>Unauthorized</div>;
	}

	const { payload } = await verifyAuthToken(token.value);
	if (!payload) {
		return <div>Invalid token</div>;
	}

	const { user } = await getAccountData(payload.userID);

	return (
		<div className="container mx-auto py-6">
			<Account
				user={user}
				userID={payload.userID}
			/>
		</div>
	);
}