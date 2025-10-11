import { tableTemplates } from "@/constants/table-templates";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "lucide-react";

export function TableTemplates() {
	const applyTemplate = (templateKey: string) => {
		const template = tableTemplates[templateKey];
		if (!template) return;

		// Update the table with the template's columns and data
		tableBuilderCollection.update(1, (draft) => {
			(draft as any).table = {
				columns: template.columns,
				data: template.sampleData || [],
			};
		});
	};

	return (
		<div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
			<div className="mb-4 pb-2 px-4 border-b">
				<h3 className="text-lg font-semibold text-primary">Table Templates</h3>
				<p className="text-sm text-muted-foreground">
					Predefined table templates
				</p>
			</div>
			<ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
				<div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground mb-2">
							Templates
						</h3>
						<div className="space-y-2">
							{Object.entries(tableTemplates).map(([key, template]) => (
								<Button
									key={key}
									onClick={() => applyTemplate(key)}
									className="justify-start text-[12px] w-full"
									variant="ghost"
								>
									<Database className="size-4 mr-2" />
									{template.name}
								</Button>
							))}
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
