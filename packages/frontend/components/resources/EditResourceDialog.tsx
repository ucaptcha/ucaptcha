import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

interface EditResourceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	resourceName: string;
	onResourceNameChange: (name: string) => void;
	onUpdate: () => void;
}

export function EditResourceDialog({
	open,
	onOpenChange,
	resourceName,
	onResourceNameChange,
	onUpdate
}: EditResourceDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Resource</DialogTitle>
					<DialogDescription>Update your resource information</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label className="mb-2" htmlFor="editResourceName">
							Resource Name
						</Label>
						<Input
							id="editResourceName"
							value={resourceName}
							onChange={(e) => onResourceNameChange(e.target.value)}
							placeholder="Enter resource name"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onUpdate} disabled={!resourceName.trim()}>
						Update Resource
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							onResourceNameChange("");
						}}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
