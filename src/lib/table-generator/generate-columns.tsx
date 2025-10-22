import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import {
	DataGridTableRowSelect,
	DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilterFieldConfig } from "@/components/ui/filters";
import type { ColumnConfig, DataRow, JsonData } from "@/types/table-types";

interface ColumnSettings {
	enableSorting?: boolean;
	enableHiding?: boolean;
	enableResizing?: boolean;
	enablePinning?: boolean;
	enableRowSelection?: boolean;
	enableCRUD?: boolean;
}

// Row actions component
function RowActions({ row: _row }: { row: any }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex justify-end">
					<Button
						size="icon"
						variant="ghost"
						className="shadow-none"
						aria-label="Edit item"
					>
						<EllipsisIcon size={16} aria-hidden="true" />
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Edit</span>
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span>Duplicate</span>
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Archive</span>
						<DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive focus:text-destructive">
					<span>Delete</span>
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Generate cell content based on column type
function renderCell(
	value: any,
	type: ColumnConfig["type"],
	columnId?: string,
	onToggleExpand?: (columnId: string, rowId: string) => void,
	expandedRows?: Set<string>,
) {
	switch (type) {
		case "string":
			return <div className="font-medium">{String(value || "")}</div>;
		case "number":
			return (
				<div>
					{typeof value === "number"
						? value.toLocaleString()
						: String(value || "")}
				</div>
			);
		case "boolean":
			return <Badge variant="outline">{String(value || "")}</Badge>;
		case "date":
			if (value) {
				const date = new Date(value);
				return <div>{date.toLocaleDateString()}</div>;
			}
			return <div></div>;
		case "object":
			return (
				<div className="text-xs text-muted-foreground">
					{value ? JSON.stringify(value) : ""}
				</div>
			);
		case "array": {
			if (!Array.isArray(value)) {
				return <div>{String(value || "")}</div>;
			}

			const rowId = columnId ? `${columnId}-${JSON.stringify(value)}` : "";
			const isExpanded = expandedRows?.has(rowId) || false;
			const displayItems = isExpanded ? value : value.slice(0, 2);
			const hasMoreItems = value.length > 2;

			return (
				<div className="flex flex-wrap gap-1">
					{displayItems.map((item, index) => {
						const colors = [
							"border-blue-500",
							"border-green-500",
							"border-yellow-500",
							"border-purple-500",
							"border-pink-500",
							"border-indigo-500",
							"border-red-500",
							"border-orange-500",
							"border-teal-500",
							"border-cyan-500",
						];
						const colorIndex = index % colors.length;
						return (
							<Badge
								key={index}
								variant="outline"
								className={`text-xs ${colors[colorIndex]}`}
							>
								{String(item)}
							</Badge>
						);
					})}
					{hasMoreItems && (
						<Badge
							variant="outline"
							className="text-xs cursor-pointer hover:bg-secondary transition-colors"
							onClick={() => {
								if (onToggleExpand && columnId) {
									onToggleExpand(columnId, rowId);
								}
							}}
						>
							{isExpanded ? "−" : `+${value.length - 2}`}
						</Badge>
					)}
				</div>
			);
		}
		default:
			return <div>{String(value || "")}</div>;
	}
}

export function generateColumns(
	columns: ColumnConfig[],
	settings?: ColumnSettings,
	expandableOptions?: {
		expandedRows?: Set<string>;
		onToggleExpand?: (columnId: string, rowId: string) => void;
	},
): ColumnDef<JsonData>[] {
	const generatedColumns: ColumnDef<JsonData>[] = columns.map((col) => {
		const base = {
			id: col.id,
			accessorKey: col.accessor,
			header: ({ column }: { column: any }) => (
				<DataGridColumnHeader title={col.label} column={column} />
			),
			cell: ({ row }: { row: any }) =>
				renderCell(
					row.getValue(col.accessor),
					col.type,
					col.id,
					expandableOptions?.onToggleExpand,
					expandableOptions?.expandedRows,
				),
			size: 180, // Default size, can be customized
			enableSorting: settings?.enableSorting ?? true,
			enableHiding: settings?.enableHiding ?? true,
			enableResizing: settings?.enableResizing ?? true,
			enablePinning: settings?.enablePinning ?? true,
			meta: {
				type: col.type,
				filterable: col.filterable,
			} as any,
		};

		if (col.type === "number") {
			return {
				...base,
				filterFn: (row: any, columnId: string, filterValue: unknown) => {
					if (!filterValue) return true;
					const [min, max] = filterValue as [number, number];
					const value = row.getValue(columnId) as number;
					return value >= min && value <= max;
				},
			};
		}

		return base;
	});

	const resultColumns: ColumnDef<JsonData>[] = [];

	// Conditionally add select column
	if (settings?.enableRowSelection) {
		const selectColumn: ColumnDef<JsonData> = {
			id: "select",
			header: () => <DataGridTableRowSelectAll />,
			cell: ({ row }) => <DataGridTableRowSelect row={row} />,
			size: 28,
			enableSorting: false,
			enableHiding: false,
			enableResizing: false,
			enablePinning: false,
		};
		resultColumns.push(selectColumn);
	}

	// Add generated columns
	resultColumns.push(...generatedColumns);

	// Conditionally add actions column
	if (settings?.enableCRUD) {
		const actionsColumn: ColumnDef<JsonData> = {
			id: "actions",
			header: () => <span className="sr-only">Actions</span>,
			cell: ({ row }) => <RowActions row={row} />,
			size: 60,
			enableHiding: false,
			enableSorting: false,
			enableResizing: false,
			enablePinning: false,
		};
		resultColumns.push(actionsColumn);
	}

	return resultColumns;
}

/**
 * Generate filter field configurations for DataGrid filters based on table columns
 */
export function generateFilterFields(
	columns: ColumnConfig[],
	data?: DataRow[],
): FilterFieldConfig[] {
	return columns
		.filter((col) => col.filterable)
		.map((col) => {
			const baseConfig: FilterFieldConfig = {
				key: col.accessor,
				label: col.label,
				type:
					col.type === "string"
						? "text"
						: col.type === "number"
							? "number"
							: col.type === "boolean"
								? "boolean"
								: col.type === "date"
									? "date"
									: col.type === "enum"
										? "select"
										: col.type === "array"
											? "multiselect"
											: "text",
				placeholder: `Filter by ${col.label.toLowerCase()}...`,
			};

			// Add specific configurations based on column type
			if (col.type === "boolean") {
				baseConfig.onLabel = "True";
				baseConfig.offLabel = "False";
			}

			// For enum columns, generate options from data
			if (col.type === "enum" && data) {
				const uniqueValues = [
					...new Set(
						data
							.map((row) => String(row[col.accessor] || ""))
							.filter((val) => val),
					),
				];
				baseConfig.options = uniqueValues.map((value) => ({
					label: value,
					value: value,
				}));
				// For enum fields with few options, disable search
				baseConfig.searchable = uniqueValues.length <= 5;
				// Set appropriate width for enum fields
				baseConfig.className = "w-[160px]";
			}

			// For array columns, generate options from all unique array items
			if (col.type === "array" && data) {
				const uniqueValues = [
					...new Set(
						data
							.flatMap((row) => {
								const value = row[col.accessor];
								return Array.isArray(value) ? value.map(String) : [];
							})
							.filter((val) => val),
					),
				];
				baseConfig.options = uniqueValues.map((value) => ({
					label: value,
					value: value,
				}));
				// Enable search for array fields since they can have many items
				baseConfig.searchable = true;
				// Set appropriate width for array fields
				baseConfig.className = "w-[200px]";
			}

			return baseConfig;
		});
}

import { detectColumnsConfig } from "@/lib/column-detection";

export const detectColumns = (data: JsonData[]) => detectColumnsConfig(data);
