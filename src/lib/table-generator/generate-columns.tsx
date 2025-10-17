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
import type { ColumnConfig, JsonData } from "@/types/table-types";

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
function renderCell(value: any, type: ColumnConfig["type"]) {
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
		default:
			return <div>{String(value || "")}</div>;
	}
}

export function generateColumns(
	columns: ColumnConfig[],
	settings?: ColumnSettings,
): ColumnDef<JsonData>[] {
	const generatedColumns: ColumnDef<JsonData>[] = columns.map((col) => {
		const base = {
			id: col.id,
			accessorKey: col.accessor,
			header: ({ column }: { column: any }) => (
				<DataGridColumnHeader title={col.label} column={column} />
			),
			cell: ({ row }: { row: any }) =>
				renderCell(row.getValue(col.accessor), col.type),
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
									: "text",
				placeholder: `Filter by ${col.label.toLowerCase()}...`,
			};

			// Add specific configurations based on column type
			if (col.type === "boolean") {
				baseConfig.onLabel = "True";
				baseConfig.offLabel = "False";
			}

			return baseConfig;
		});
}

export const detectColumnType = (
	value: string | number | boolean | null | undefined | object,
): ColumnConfig["type"] => {
	if (value === null || value === undefined) return "string";
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	if (typeof value === "object") return "object";
	if (typeof value === "string") {
		// Try to detect dates
		const dateRegex =
			/^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/;
		if (dateRegex.test(value) && !Number.isNaN(Date.parse(value))) {
			return "date";
		}
	}
	return "string";
};

export const detectColumns = (data: JsonData[]) => {
	if (data.length === 0) return [];

	const firstRow = data[0];
	const detectedColumns: ColumnConfig[] = [];

	Object.keys(firstRow).forEach((key, index) => {
		// Sample rows to get better type detection
		const sampleValues = data.map((row) => row[key]);
		const types = sampleValues.map(detectColumnType);
		let mostCommonType = types.reduce((a, b, _, arr) =>
			arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
				? a
				: b,
		);

		// If type is string, check if it has exactly 2 unique values (boolean-like)
		if (mostCommonType === "string") {
			const uniqueValues = [...new Set(sampleValues.map((v) => String(v)))];
			if (uniqueValues.length === 2) {
				mostCommonType = "boolean";
			}
		}

		detectedColumns.push({
			id: key,
			accessor: key,
			label:
				key.charAt(0).toUpperCase() +
				key
					.slice(1)
					.replace(/([A-Z])/g, " $1")
					.trim(),
			type: mostCommonType,
			order: index,
		});
	});

	return detectedColumns.sort((a, b) => a.order - b.order);
};
