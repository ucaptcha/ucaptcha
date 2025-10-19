"use server";

import { revalidatePath } from "next/cache";
import {
	getDifficultyConfigs,
	createDifficultyConfig,
	updateDifficultyConfig,
	deleteDifficultyConfig
} from "@shared/db/core/difficulty";
import { getSites } from "@shared/db/core/sites";
import { getResources } from "@shared/db/core/resources";
import { DifficultyConfigValue } from "@shared/db/core/schema";

export async function getDifficultyData(userID: number, siteID?: number) {
	const difficultyConfigs = await getDifficultyConfigs(userID, siteID);
	const sites = await getSites(userID);
	const resources = await getResources(userID, siteID);

	return { difficultyConfigs, sites, resources };
}

export async function createDifficultyConfigAction(userID: number, formData: FormData) {
	const siteID = parseInt(formData.get("siteID") as string);
	const resourceID = formData.get("resourceID") as string;
	const defaultDifficulty = parseInt(formData.get("defaultDifficulty") as string);
	const customRulesJson = formData.get("customRules") as string;

	if (!siteID || isNaN(defaultDifficulty)) {
		throw new Error("Site ID and default difficulty are required");
	}

	let customRules: DifficultyConfigValue["custom"] = [];
	if (customRulesJson) {
		try {
			customRules = JSON.parse(customRulesJson);
		} catch (error) {
			console.error("Error parsing custom rules:", error);
		}
	}

	const difficultyConfig: DifficultyConfigValue = {
		default: defaultDifficulty,
		custom: customRules
	};

	await createDifficultyConfig({
		siteID,
		resourceID: resourceID ? parseInt(resourceID) : null,
		difficultyConfig
	});

	revalidatePath("/difficulty");
	revalidatePath(`/difficulty/${siteID}`);
}

export async function updateDifficultyConfigAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);
	const defaultDifficulty = parseInt(formData.get("defaultDifficulty") as string);
	const customRulesJson = formData.get("customRules") as string;

	if (!id || isNaN(defaultDifficulty)) {
		throw new Error("ID and default difficulty are required");
	}

	let customRules: DifficultyConfigValue["custom"] = [];
	if (customRulesJson) {
		try {
			customRules = JSON.parse(customRulesJson);
		} catch (error) {
			console.error("Error parsing custom rules:", error);
		}
	}

	const difficultyConfig: DifficultyConfigValue = {
		default: defaultDifficulty,
		custom: customRules
	};

	await updateDifficultyConfig({
		id,
		difficultyConfig
	});

	revalidatePath("/difficulty");
}

export async function deleteDifficultyConfigAction(userID: number, formData: FormData) {
	const id = parseInt(formData.get("id") as string);

	if (!id) {
		throw new Error("ID is required");
	}

	await deleteDifficultyConfig(id);
	revalidatePath("/difficulty");
}