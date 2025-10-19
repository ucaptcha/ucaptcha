"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SiteFilter } from "./resources/SiteFilter";
import { CreateResourceDialog } from "./resources/CreateResourceDialog";
import { EditResourceDialog } from "./resources/EditResourceDialog";
import { ResourcesList } from "./resources/ResourcesList";
import { DeleteResourceDialog } from "./resources/DeleteResourceDialog";
import {
	createResourceAction,
	updateResourceAction,
	deleteResourceAction
} from "@/app/(dashboard)/resources/actions";
import { Resource as ResourceType, Site } from "@shared/db/core/schema";

interface ResourceWithSite extends ResourceType {
	siteName: string;
}

interface ResourcesProps {
	resources: ResourceWithSite[];
	sites: Site[];
	userID: number;
	selectedSiteId?: number;
}

export default function Resources({ resources, sites, selectedSiteId, userID }: ResourcesProps) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingResource, setEditingResource] = useState<ResourceWithSite | null>(null);
	const [newResourceName, setNewResourceName] = useState("");
	const [selectedSiteIdForCreate, setSelectedSiteIdForCreate] = useState<number | "all">(
		selectedSiteId || "all"
	);
	const [resourceToDelete, setResourceToDelete] = useState<ResourceWithSite | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSiteFilterChange = (siteID: number | "all") => {
		if (siteID === "all") {
			router.push("/resources");
		} else {
			router.push(`/resources/${siteID}`);
		}
	};

	const handleCreateResource = async () => {
		if (!newResourceName.trim() || !selectedSiteIdForCreate) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("name", newResourceName);
			formData.append("siteID", selectedSiteIdForCreate.toString());

			await createResourceAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewResourceName("");
			setSelectedSiteIdForCreate("all");
			setShowCreateForm(false);
		} catch (error) {
			console.error("Error creating resource:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateResource = async () => {
		if (!editingResource || !newResourceName.trim()) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", editingResource.id.toString());
			formData.append("name", newResourceName);

			await updateResourceAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewResourceName("");
			setEditingResource(null);
		} catch (error) {
			console.error("Error updating resource:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteResource = async () => {
		if (!resourceToDelete) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", resourceToDelete.id.toString());

			await deleteResourceAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setResourceToDelete(null);
		} catch (error) {
			console.error("Error deleting resource:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="font-sans">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold mt-4">Resources</h1>
				<Button onClick={() => setShowCreateForm(true)} disabled={isLoading}>
					<Plus className="w-4 h-4 mr-2" />
					Add Resource
				</Button>
			</div>

			{/* Site Filter */}
			<SiteFilter
				sites={sites}
				selectedSiteId={selectedSiteId}
				onSiteFilterChange={handleSiteFilterChange}
			/>

			{/* Create Resource Dialog */}
			<CreateResourceDialog
				open={showCreateForm}
				onOpenChange={setShowCreateForm}
				resourceName={newResourceName}
				onResourceNameChange={setNewResourceName}
				selectedSiteId={selectedSiteIdForCreate}
				onSiteIdChange={setSelectedSiteIdForCreate}
				sites={sites}
				onCreate={handleCreateResource}
			/>

			{/* Edit Resource Dialog */}
			<EditResourceDialog
				open={!!editingResource}
				onOpenChange={(open) => !open && setEditingResource(null)}
				resourceName={newResourceName}
				onResourceNameChange={setNewResourceName}
				onUpdate={handleUpdateResource}
			/>

			{/* Resources List */}
			<ResourcesList
				resources={resources}
				selectedSiteId={selectedSiteId}
				onEdit={(resource) => {
					setEditingResource(resource);
					setNewResourceName(resource.name);
				}}
				onDelete={setResourceToDelete}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteResourceDialog
				open={!!resourceToDelete}
				onOpenChange={(open: boolean) => !open && setResourceToDelete(null)}
				resource={resourceToDelete}
				onDelete={handleDeleteResource}
				isLoading={isLoading}
			/>
		</div>
	);
}
