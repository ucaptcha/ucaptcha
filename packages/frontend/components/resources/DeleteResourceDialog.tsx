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
import { Resource } from "@shared/db/core/schema";

interface DeleteResourceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	resource: Resource | null;
	onDelete: () => void;
	isLoading?: boolean;
}

export function DeleteResourceDialog({
	open,
	onOpenChange,
	resource,
	onDelete,
	isLoading = false
}: DeleteResourceDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the resource "
						{resource?.name}" and remove all associated data.
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
