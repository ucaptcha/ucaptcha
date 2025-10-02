"use server";

import { getUserQuota } from "@db/quota";

export async function getQuota(uid: number) {
	return getUserQuota(uid, false);
}