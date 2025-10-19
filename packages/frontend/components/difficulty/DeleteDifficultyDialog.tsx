"use client";

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
import { DifficultyConfigWithRelations } from "@shared/db/core/difficulty";

interface DeleteDifficultyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	difficulty: DifficultyConfigWithRelations | null;
	onDelete: () => void;
	isLoading: boolean;
}

export function DeleteDifficultyDialog({
	open,
	onOpenChange,
	difficulty,
	onDelete,
	isLoading
}: DeleteDifficultyDialogProps) {
	const getConfigDescription = (config: DifficultyConfigWithRelations) => {
		if (config.resourceID === null) {
			return `default configuration for site "${config.siteName}"`;
		} else {
			return `configuration for resource "${config.resourceName}" in site "${config.siteName}"`;
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the{" "}
						{difficulty ? getConfigDescription(difficulty) : "difficulty configuration"} and remove all associated data.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onDelete} disabled={isLoading}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}