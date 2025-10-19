"use server";

import { revalidatePath } from "next/cache";
import { createSite } from "@shared/db/core/sites/createSite";
import { updateSite } from "@shared/db/core/sites/updateSite";
import { deleteSite } from "@shared/db/core/sites/deleteSite";
import { getSites, siteBelongsToUser } from "@shared/db/core/sites/getSite";

export async function getSitesData(userID: number) {
	const sites = await getSites(userID);
	return { sites };
}

export async function createSiteAction(userID: number, formData: FormData) {
	const name = formData.get("name") as string;

	if (!name) {
		throw new Error("Name is required");
	}

	await createSite({
		name,
		userID
	});

	revalidatePath("/sites");
}

export async function updateSiteAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);
	const name = formData.get("name") as string;

	if (!id || !name) {
		throw new Error("ID and name are required");
	}

	const valid = await siteBelongsToUser(id, userID);

	if (!valid) {
		throw new Error("Site not found or access denied");
	}

	await updateSite(id, { name });
	revalidatePath("/sites");
}

export async function deleteSiteAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);

	if (!id) {
		throw new Error("ID is required");
	}

	const valid = await siteBelongsToUser(id, userID);

	if (!valid) {
		throw new Error("Site not found or access denied");
	}

	await deleteSite(id);
	revalidatePath("/sites");
}
