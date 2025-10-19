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
import { CustomRulesManager, type CustomRule } from "./CustomRulesManager";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditDifficultyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultDifficulty: string;
	onDefaultDifficultyChange: (value: string) => void;
	customRules: CustomRule[];
	onCustomRulesChange: (rules: CustomRule[]) => void;
	onUpdate: () => void;
}

export function EditDifficultyDialog({
	open,
	onOpenChange,
	defaultDifficulty,
	onDefaultDifficultyChange,
	customRules,
	onCustomRulesChange,
	onUpdate
}: EditDifficultyDialogProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async () => {
		setIsLoading(true);
		try {
			await onUpdate();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Difficulty Configuration</DialogTitle>
					<DialogDescription>Update the difficulty configuration</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[50vh]">
					<div className="mb-4">
						<Label className="mb-2" htmlFor="editDefaultDifficulty">
							Default Difficulty
						</Label>
						<Input
							id="editDefaultDifficulty"
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
						onClick={handleUpdate}
						disabled={!defaultDifficulty.trim() || isLoading}
					>
						Update Configuration
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							onDefaultDifficultyChange("");
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
