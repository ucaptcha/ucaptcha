"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SiteFilter } from "./resources/SiteFilter";
import { CreateDifficultyDialog } from "./difficulty/CreateDifficultyDialog";
import { EditDifficultyDialog } from "./difficulty/EditDifficultyDialog";
import { DifficultyList } from "./difficulty/DifficultyList";
import { DeleteDifficultyDialog } from "./difficulty/DeleteDifficultyDialog";
import {
	createDifficultyConfigAction,
	updateDifficultyConfigAction,
	deleteDifficultyConfigAction
} from "@/app/(dashboard)/difficulty/actions";
import { DifficultyConfigWithRelations } from "@shared/db/core/difficulty";
import { Site, Resource } from "@shared/db/core/schema";
import type { CustomRule } from "./difficulty/CustomRulesManager";

interface DifficultyProps {
	difficultyConfigs: DifficultyConfigWithRelations[];
	sites: Site[];
	resources: Resource[];
	userID: number;
	selectedSiteId?: number;
}

export default function Difficulty({
	difficultyConfigs,
	sites,
	resources,
	selectedSiteId,
	userID
}: DifficultyProps) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingDifficulty, setEditingDifficulty] =
		useState<DifficultyConfigWithRelations | null>(null);
	const [newDefaultDifficulty, setNewDefaultDifficulty] = useState("");
	const [selectedSiteIdForCreate, setSelectedSiteIdForCreate] = useState<number | "all">(
		selectedSiteId || "all"
	);
	const [selectedResourceIdForCreate, setSelectedResourceIdForCreate] = useState<number | "">("");
	const [customRules, setCustomRules] = useState<CustomRule[]>([]);
	const [difficultyToDelete, setDifficultyToDelete] =
		useState<DifficultyConfigWithRelations | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSiteFilterChange = (siteID: number | "all") => {
		if (siteID === "all") {
			router.push("/difficulty");
		} else {
			router.push(`/difficulty/${siteID}`);
		}
	};

	const handleCreateDifficulty = async () => {
		if (!selectedSiteIdForCreate || !newDefaultDifficulty.trim()) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("siteID", selectedSiteIdForCreate.toString());
			formData.append("resourceID", selectedResourceIdForCreate.toString());
			formData.append("defaultDifficulty", newDefaultDifficulty);
			formData.append("customRules", JSON.stringify(customRules));

			await createDifficultyConfigAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewDefaultDifficulty("");
			setSelectedSiteIdForCreate("all");
			setSelectedResourceIdForCreate("");
			setCustomRules([]);
			setShowCreateForm(false);
		} catch (error) {
			console.error("Error creating difficulty config:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateDifficulty = async () => {
		if (!editingDifficulty || !newDefaultDifficulty.trim()) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", editingDifficulty.id.toString());
			formData.append("defaultDifficulty", newDefaultDifficulty);
			formData.append("customRules", JSON.stringify(customRules));

			await updateDifficultyConfigAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewDefaultDifficulty("");
			setCustomRules([]);
			setEditingDifficulty(null);
		} catch (error) {
			console.error("Error updating difficulty config:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteDifficulty = async () => {
		if (!difficultyToDelete) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", difficultyToDelete.id.toString());

			await deleteDifficultyConfigAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setDifficultyToDelete(null);
		} catch (error) {
			console.error("Error deleting difficulty config:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-sans">
			<div className="flex justify-between items-baseline">
				<h1 className="text-3xl font-bold mt-4">Difficulty Config</h1>
				<Button onClick={() => setShowCreateForm(true)} disabled={isLoading}>
					<Plus className="w-4 h-4 mr-0.5" />
					Add
				</Button>
			</div>

			{/* Site Filter */}
			<SiteFilter
				sites={sites}
				selectedSiteId={selectedSiteId}
				onSiteFilterChange={handleSiteFilterChange}
			/>

			{/* Create Difficulty Dialog */}
			<CreateDifficultyDialog
				open={showCreateForm}
				onOpenChange={setShowCreateForm}
				defaultDifficulty={newDefaultDifficulty}
				onDefaultDifficultyChange={setNewDefaultDifficulty}
				selectedSiteId={selectedSiteIdForCreate}
				onSiteIdChange={setSelectedSiteIdForCreate}
				selectedResourceId={selectedResourceIdForCreate}
				onResourceIdChange={setSelectedResourceIdForCreate}
				customRules={customRules}
				onCustomRulesChange={setCustomRules}
				sites={sites}
				resources={resources}
				onCreate={handleCreateDifficulty}
			/>

			{/* Edit Difficulty Dialog */}
			<EditDifficultyDialog
				open={!!editingDifficulty}
				onOpenChange={(open) => !open && setEditingDifficulty(null)}
				defaultDifficulty={newDefaultDifficulty}
				onDefaultDifficultyChange={setNewDefaultDifficulty}
				customRules={customRules}
				onCustomRulesChange={setCustomRules}
				onUpdate={handleUpdateDifficulty}
			/>

			{/* Difficulty List */}
			<DifficultyList
				difficultyConfigs={difficultyConfigs}
				selectedSiteId={selectedSiteId}
				selectedSiteName={sites.find((site) => site.id === selectedSiteId)?.name}
				onEdit={(config) => {
					setEditingDifficulty(config);
					setNewDefaultDifficulty(config.difficultyConfig.default.toString());
					setCustomRules(config.difficultyConfig.custom);
				}}
				onDelete={setDifficultyToDelete}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteDifficultyDialog
				open={!!difficultyToDelete}
				onOpenChange={(open: boolean) => !open && setDifficultyToDelete(null)}
				difficulty={difficultyToDelete}
				onDelete={handleDeleteDifficulty}
				isLoading={isLoading}
			/>
		</div>
	);
}
