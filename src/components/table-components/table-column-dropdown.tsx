import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tableColumnTypes } from "@/constants/form-elements-list";

export function TableColumnDropdown({
	onAddColumn,
}: {
	onAddColumn: (type: string) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" variant="outline" size="sm" className="h-8 px-2">
					<PlusCircle className="h-4 w-4 mr-1" />
					Add Column
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent data-align="end" className="p-0">
				<div className="space-y-1 p-2">
					{tableColumnTypes.map((columnType) => (
						<DropdownMenuItem
							key={columnType.type}
							onSelect={() => onAddColumn(columnType.type)}
							className="px-3 py-2"
						>
							<div className="flex items-center gap-2">
								<columnType.icon className="h-4 w-4" />
								{columnType.name}
							</div>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
