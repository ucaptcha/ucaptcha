"use server";

import { revalidatePath } from "next/cache";
import {
	getResources,
	createResource,
	updateResource,
	deleteResource,
	resourceBelongsToUser
} from "@db/resources";

import { getSites } from "@db/sites";

export async function getResourcesData(userID: number, siteID?: number) {
	const resources = await getResources(userID, siteID);
	const sites = await getSites(userID);
	/*  */
	return { resources, sites };
}

export async function createResourceAction(userID: number, formData: FormData) {
	const name = formData.get("name") as string;
	const siteID = parseInt(formData.get("siteID") as string);

	if (!name || !siteID) {
		throw new Error("Name and site are required");
	}

	const siteValid = await resourceBelongsToUser(siteID, userID);

	if (!siteValid) {
		throw new Error("Site not found or access denied");
	}

	await createResource({
		name,
		siteID
	});

	revalidatePath("/resources");
	revalidatePath(`/resources/${siteID}`);
}

export async function updateResourceAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);
	const name = formData.get("name") as string;

	if (!id || !name) {
		throw new Error("ID and name are required");
	}

	const valid = await resourceBelongsToUser(id, userID);

	if (!valid) {
		throw new Error("Site not found or access denied");
	}

	await updateResource(id, { name });
	revalidatePath("/resources");
}

export async function deleteResourceAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);

	if (!id) {
		throw new Error("ID is required");
	}

	const valid = await resourceBelongsToUser(id, userID);

	console.log(id, userID);

	if (!valid) {
		throw new Error("Site not found or access denied");
	}

	await deleteResource(id);
	revalidatePath("/resources");
}
