import { TableBuilderService } from "@/services/table-builder.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/delete";
import { LucideGripVertical } from "lucide-react";
import { Reorder } from "motion/react";
import { useState, useEffect } from "react";
import useTableStore from "@/hooks/use-table-store";
import type { TableBuilder } from "@/db-collections/table-builder.collections";
import { ScrollArea } from "../ui/scroll-area";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TableColumnDropdown } from "./table-column-dropdown";

export function TableColumnEdit() {
	const [localColumns, setLocalColumns] = useState<
		TableBuilder["table"]["columns"]
	>([]);

	// Get the current table data using the store
	const tableData = useTableStore();

	useEffect(() => {
		if (tableData) {
			setLocalColumns(tableData.table.columns);
		}
	}, [tableData]);

	if (!tableData) {
		return <div>No table data found</div>;
	}

	const columns = tableData.table.columns;

	const updateColumn = (
		columnId: string,
		updates: Partial<(typeof columns)[0]>,
	) => {
		TableBuilderService.updateColumn(columnId, updates);
	};

	const reorderColumns = (newOrder: typeof columns) => {
		TableBuilderService.reorderColumns(newOrder);
		setLocalColumns(newOrder);
	};

	const deleteColumn = (columnId: string) => {
		TableBuilderService.deleteColumn(columnId);
	};

	const addColumn = (type: string) => {
		TableBuilderService.addColumn(
			type as TableBuilder["table"]["columns"][0]["type"],
		);
	};

	return (
		<div className="w-full space-y-4">
			<div className="mb-4 pb-2 px-4 border-b">
				<h3 className="text-lg font-semibold text-primary">Columns</h3>
				<p className="text-sm text-muted-foreground">
					Add Columns to Your Forms
				</p>
			</div>
			<div className="flex items-center justify-between">
				<Label className="text-sm font-medium">Table Columns</Label>
				<TableColumnDropdown onAddColumn={addColumn} />
			</div>

			<ScrollArea className="h-[calc(100vh-20rem)]">
				<Reorder.Group
					axis="y"
					onReorder={reorderColumns}
					values={localColumns}
					className="space-y-2"
				>
					{localColumns.map((column) => (
						<Reorder.Item
							key={column.id}
							value={column}
							className="w-full rounded-xl border border-dashed py-1.5 bg-background"
						>
							<div className="w-full group">
								<div className="flex items-center justify-between px-2">
									<div className="flex items-center justify-start gap-2 size-full">
										<LucideGripVertical
											size={20}
											className="dark:text-muted-foreground text-muted-foreground"
										/>
										<span className="truncate max-w-xs md:max-w-sm">
											{column.label}
										</span>
									</div>
									<div className="flex items-center justify-end lg:opacity-0 opacity-100 group-hover:opacity-100 duration-100">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => deleteColumn(column.id)}
											className="rounded-xl h-9"
										>
											<DeleteIcon />
										</Button>
									</div>
								</div>
								<Accordion type="single" collapsible className="w-full">
									<AccordionItem
										value={`item-${column.id}`}
										className="border-none"
									>
										<AccordionTrigger className="px-2 py-1 text-sm text-muted-foreground hover:no-underline">
											Customize Column
										</AccordionTrigger>
										<AccordionContent className="px-2 pb-4 space-y-4">
											<div className="flex gap-2">
												<div className="flex-1">
													<Label className="text-xs text-muted-foreground">
														Column Name
													</Label>
													<Input
														value={column.label}
														onChange={(e) => {
															updateColumn(column.id, {
																label: e.target.value,
															});
														}}
														placeholder="Column name"
														className="h-8 text-sm"
													/>
												</div>
											</div>
											<div className="flex gap-2">
												<div className="flex-1">
													<Label className="text-xs text-muted-foreground">
														Accessor
													</Label>
													<Input
														value={column.accessor}
														onChange={(e) => {
															updateColumn(column.id, {
																accessor: e.target.value,
															});
														}}
														placeholder="Accessor key"
														className="h-8 text-sm"
													/>
												</div>
												<div className="flex-1">
													<Label className="text-xs text-muted-foreground">
														Type
													</Label>
													<Select
														value={column.type}
														onValueChange={(value) => {
															updateColumn(column.id, {
																type: value as TableBuilder["table"]["columns"][0]["type"],
															});
														}}
													>
														<SelectTrigger className="h-8 text-sm">
															<SelectValue placeholder="Select type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="string">String</SelectItem>
															<SelectItem value="number">Number</SelectItem>
															<SelectItem value="boolean">Boolean</SelectItem>
															<SelectItem value="date">Date</SelectItem>
															<SelectItem value="object">Object</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<input
													type="checkbox"
													id={`filterable-${column.id}`}
													checked={column.filterable || false}
													onChange={(e) => {
														updateColumn(column.id, {
															filterable: e.target.checked,
														});
													}}
													className="h-4 w-4"
												/>
												<Label
													htmlFor={`filterable-${column.id}`}
													className="text-xs text-muted-foreground"
												>
													Enable Filtering
												</Label>
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</div>
						</Reorder.Item>
					))}
				</Reorder.Group>

				{columns.length === 0 && (
					<div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-md">
						No columns added yet. Click "Add Column" to get started.
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
