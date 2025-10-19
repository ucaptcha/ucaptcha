import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Site } from "@shared/db/core/schema";

interface SiteFilterProps {
	sites: Site[];
	selectedSiteId?: number;
	onSiteFilterChange: (siteID: number | "all") => void;
}

export function SiteFilter({ sites, selectedSiteId, onSiteFilterChange }: SiteFilterProps) {
	return (
		<div className="mt-4">
			<Label className="mb-2" htmlFor="filterSite">
				Filter by Site
			</Label>
			<Select
				value={selectedSiteId?.toString() || "all"}
				onValueChange={(value) =>
					onSiteFilterChange(isNaN(parseInt(value)) ? "all" : parseInt(value))
				}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Sites</SelectItem>
					{sites.map((site) => (
						<SelectItem key={site.id} value={site.id.toString()}>
							{site.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
