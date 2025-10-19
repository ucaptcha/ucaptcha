"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Site } from "@shared/db/core/schema";
import {
	createSiteAction,
	updateSiteAction,
	deleteSiteAction
} from "@/app/(dashboard)/sites/actions";

interface SitesProps {
	initialSites: Site[];
	userID: number;
}

export default function Sites({ initialSites, userID }: SitesProps) {
	const [sites, setSites] = useState<Site[]>(initialSites);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingSite, setEditingSite] = useState<Site | null>(null);
	const [newSiteName, setNewSiteName] = useState("");
	const [copiedKey, setCopiedKey] = useState<string | null>(null);
	const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleCreateSite = async () => {
		if (!newSiteName.trim()) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("name", newSiteName);

			await createSiteAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewSiteName("");
			setShowCreateForm(false);
		} catch (error) {
			console.error("Error creating site:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateSite = async () => {
		if (!editingSite || !newSiteName.trim()) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", editingSite.id.toString());
			formData.append("name", newSiteName);

			await updateSiteAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setNewSiteName("");
			setEditingSite(null);
		} catch (error) {
			console.error("Error updating site:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteSite = async () => {
		if (!siteToDelete) return;

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("id", siteToDelete.id.toString());

			await deleteSiteAction(userID, formData);

			// Refresh the page to get updated data
			router.refresh();
			setSiteToDelete(null);
		} catch (error) {
			console.error("Error deleting site:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedKey(text);
			setTimeout(() => setCopiedKey(null), 2000);
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};

	return (
		<div className="font-sans">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold mt-4 ml-1">Sites</h1>
				<Button onClick={() => setShowCreateForm(true)} disabled={isLoading}>
					<Plus className="w-4 h-4 mr-2" />
					Add Site
				</Button>
			</div>

			{/* Create Site Dialog */}
			<Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Site</DialogTitle>
						<DialogDescription>Add a new site to manage</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label className="mb-2" htmlFor="createSiteName">
								Site Name
							</Label>
							<Input
								id="createSiteName"
								value={newSiteName}
								onChange={(e) => setNewSiteName(e.target.value)}
								placeholder="Enter site name"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={handleCreateSite}
							disabled={!newSiteName.trim() || isLoading}
						>
							Create Site
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setShowCreateForm(false);
								setNewSiteName("");
							}}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Site Dialog */}
			<Dialog
				open={!!editingSite}
				onOpenChange={(open: boolean) => !open && setEditingSite(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Site</DialogTitle>
						<DialogDescription>Update your site information</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label className="mb-2" htmlFor="editSiteName">
								Site Name
							</Label>
							<Input
								id="editSiteName"
								value={newSiteName}
								onChange={(e) => setNewSiteName(e.target.value)}
								placeholder="Enter site name"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={handleUpdateSite}
							disabled={!newSiteName.trim() || isLoading}
						>
							Update Site
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setEditingSite(null);
								setNewSiteName("");
							}}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="mt-6 grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{sites.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-muted-foreground">
								No sites found. Create your first site to get started.
							</div>
						</CardContent>
					</Card>
				) : (
					sites.map((site) => (
						<Card key={site.id}>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{site.name}</CardTitle>
										<CardDescription>
											Created: {new Date(site.createdAt).toLocaleDateString()}
										</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setEditingSite(site);
												setNewSiteName(site.name);
												setShowCreateForm(false);
											}}
										>
											<Edit className="w-4 h-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSiteToDelete(site)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div>
										<Label className="mb-2" htmlFor={`siteKey-${site.id}`}>
											Site Key
										</Label>
										<div className="flex gap-2">
											<Input
												id={`siteKey-${site.id}`}
												value={site.siteKey}
												readOnly
												className="font-mono text-sm"
											/>
											<Button
												variant="outline"
												size="sm"
												onClick={() => copyToClipboard(site.siteKey)}
											>
												{copiedKey === site.siteKey ? (
													<Check className="w-4 h-4" />
												) : (
													<Copy className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!siteToDelete}
				onOpenChange={(open: boolean) => !open && setSiteToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the site "
							{siteToDelete?.name}" and remove all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteSite} disabled={isLoading}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
