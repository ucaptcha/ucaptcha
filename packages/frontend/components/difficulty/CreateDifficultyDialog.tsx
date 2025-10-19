"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Site, Resource } from "@shared/db/core/schema";
import { CustomRulesManager, type CustomRule } from "./CustomRulesManager";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateDifficultyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultDifficulty: string;
	onDefaultDifficultyChange: (value: string) => void;
	selectedSiteId: number | "all";
	onSiteIdChange: (value: number | "all") => void;
	selectedResourceId: number | "";
	onResourceIdChange: (value: number | "") => void;
	customRules: CustomRule[];
	onCustomRulesChange: (rules: CustomRule[]) => void;
	sites: Site[];
	resources: Resource[];
	onCreate: () => void;
}

export function CreateDifficultyDialog({
	open,
	onOpenChange,
	defaultDifficulty,
	onDefaultDifficultyChange,
	selectedSiteId,
	onSiteIdChange,
	selectedResourceId,
	onResourceIdChange,
	customRules,
	onCustomRulesChange,
	sites,
	resources,
	onCreate
}: CreateDifficultyDialogProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleCreate = async () => {
		setIsLoading(true);
		try {
			await onCreate();
		} finally {
			setIsLoading(false);
		}
	};

	// Filter resources based on selected site
	const filteredResources =
		selectedSiteId !== "all"
			? resources.filter((resource) => resource.siteID === selectedSiteId)
			: resources;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Difficulty Configuration</DialogTitle>
					<DialogDescription>
						Add a new difficulty configuration for a site and resource
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[50vh]">
					<div className="mb-4">
						<Label className="mb-2" htmlFor="createSite">
							Site
						</Label>
						<Select
							value={selectedSiteId === "all" ? "" : selectedSiteId.toString()}
							onValueChange={(value) =>
								onSiteIdChange(value ? parseInt(value) : "all")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a site" />
							</SelectTrigger>
							<SelectContent>
								{sites.map((site) => (
									<SelectItem key={site.id} value={site.id.toString()}>
										{site.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="mb-4">
						<Label className="mb-2" htmlFor="createResource">
							Resource (Optional)
						</Label>
						<Select
							value={
								selectedResourceId === ""
									? "default"
									: selectedResourceId.toString()
							}
							onValueChange={(value) =>
								onResourceIdChange(value === "default" ? "" : parseInt(value))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a resource (optional)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Default (All Resources)</SelectItem>
								{filteredResources.map((resource) => (
									<SelectItem key={resource.id} value={resource.id.toString()}>
										{resource.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="mb-4">
						<Label className="mb-2" htmlFor="createDefaultDifficulty">
							Default Difficulty
						</Label>
						<Input
							id="createDefaultDifficulty"
							type="number"
							value={defaultDifficulty}
							onChange={(e) => onDefaultDifficultyChange(e.target.value)}
							placeholder="Enter default difficulty value"
						/>
					</div>

					{/* Custom Rules Manager */}
					<CustomRulesManager
						customRules={customRules}
						onCustomRulesChange={onCustomRulesChange}
					/>
				</ScrollArea>
				<DialogFooter>
					<Button
						onClick={handleCreate}
						disabled={
							!selectedSiteId ||
							selectedSiteId === "all" ||
							!defaultDifficulty.trim() ||
							isLoading
						}
					>
						Create Configuration
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							onDefaultDifficultyChange("");
							onSiteIdChange("all");
							onResourceIdChange("");
							onCustomRulesChange([]);
						}}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
