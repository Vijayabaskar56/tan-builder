// @ts-nocheck
import type { TableBuilder } from "@/db-collections/table-builder.collections";
import {
	generateFilterFields,
	applyFilters,
} from "@/lib/table-generator/generate-columns";
import { toCamelCase, toJSLiteral } from "@/lib/utils";
import type { JsonData } from "@/types/table-types";

const getComponentName = (
	tableBuilder: TableBuilder,
	customName?: string,
): string => {
	return customName || `TableComponent${tableBuilder.id}`;
};

const getDataName = (customName?: string): string => {
	return customName ? `${customName}Data` : "tableData";
};

const getTypeName = (customName?: string): string => {
	return customName ? `${customName}Data` : "TableData";
};

const generateTableLayoutProps = (
	tableLayout: TableBuilder["settings"]["tableLayout"],
): string => {
	const props: Record<string, any> = {};

	if (tableLayout?.dense) {
		props.dense = true;
	}
	if (tableLayout?.cellBorder) {
		props.cellBorder = true;
	}
	if (tableLayout?.rowBorder) {
		props.rowBorder = true;
	}
	if (tableLayout?.rowRounded) {
		props.rowRounded = true;
	}
	if (tableLayout?.stripped) {
		props.stripped = true;
	}
	if (tableLayout?.headerBorder) {
		props.headerBorder = true;
	}
	if (tableLayout?.headerSticky) {
		props.headerSticky = true;
	}
	if (tableLayout?.width) {
		props.width = tableLayout.width;
	}

	return Object.keys(props).length > 0
		? ` tableLayout={${toJSLiteral(props)}}`
		: "";
};

const generateCellRenderer = (
	column: TableBuilder["table"]["columns"][0],
): string => {
	switch (column.type) {
		case "string":
			return `cell: (info) => <span>{info.getValue() as string}</span>`;
		case "number":
			return `cell: (info) => <span>{(info.getValue() as number).toLocaleString()}</span>`;
		case "boolean":
			return `cell: (info) => <Badge variant="outline">{String(info.getValue())}</Badge>`;
		case "date":
			return `cell: (info) => {
					const date = info.getValue() as string;
					return <span>{date ? new Date(date).toLocaleDateString() : ""}</span>;
				}`;
		case "object":
			return `cell: (info) => <span className="text-xs text-muted-foreground">{JSON.stringify(info.getValue())}</span>`;
		case "array":
			return `cell: ({ row }) => {
					const value = row.getValue("${column.accessor}") as any[];
					if (!Array.isArray(value)) {
						return <div>{String(value || "")}</div>;
					}

					const rowId = row.id + "-" + JSON.stringify(value);
					const isExpanded = expandedArrayRows?.has(rowId) || false;
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
										className={"text-xs " + colors[colorIndex]}
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
										if (handleToggleArrayExpand) {
											handleToggleArrayExpand("${column.id}", rowId);
										}
									}}
								>
									{isExpanded ? "−" : "+" + (value.length - 2)}
								</Badge>
							)}
						</div>
					);
				}`;
		case "enum":
			return `cell: (info) => <span>{info.getValue() as string}</span>`;
		default:
			return `cell: (info) => <span>{String(info.getValue())}</span>`;
	}
};

const generateColumnDef = (
	column: TableBuilder["table"]["columns"][0],
	settings: TableBuilder["settings"],
): string => {
	return `{
			accessorKey: "${column.accessor}",
			id: "${column.id}",
			header: ({ column }) => (
				<DataGridColumnHeader title="${column.label}" column={column} />
			),
			${generateCellRenderer(column)},
			size: 180,
			enableSorting: ${settings.enableSorting},
			enableHiding: ${settings.enableHiding},
			enableResizing: ${settings.enableResizing},
			enablePinning: ${settings.enablePinning},
		}`;
};

const generateColumnsCode = (
	table: TableBuilder["table"],
	settings: TableBuilder["settings"],
	typeName: string,
	hasArrayColumns: boolean = false,
): string => {
	const columnDefs = table.columns.map((col) =>
		generateColumnDef(col, settings),
	);

	const dependencies = hasArrayColumns ? "[expandedArrayRows]" : "[]";
	let columnsCode = `const columns = useMemo<ColumnDef<${typeName}>[]>(
			() => [
				${columnDefs.join(",\n\t\t\t\t")}
			],
			${dependencies},
		);`;

	if (settings.enableRowSelection) {
		columnsCode = `const columns = useMemo<ColumnDef<${typeName}>[]>(
			() => [
				{
					id: "select",
					header: () => <DataGridTableRowSelectAll />,
					cell: ({ row }) => <DataGridTableRowSelect row={row} />,
					size: 28,
					enableSorting: false,
					enableHiding: false,
					enableResizing: false,
					enablePinning: false,
				},
				${columnDefs.join(",\n\t\t\t\t")}
			],
			${dependencies},
		);`;
	}

	if (settings.enableCRUD) {
		const actionsColumn = `{
				id: "actions",
				header: () => <span className="sr-only">Actions</span>,
				cell: ({ row }) => (
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
				),
				size: 60,
				enableHiding: false,
				enableSorting: false,
				enableResizing: false,
				enablePinning: false,
			}`;

		columnsCode = columnsCode.replace(
			`]`,
			`,\n\t\t\t\t${actionsColumn}\n\t\t\t]`,
		);
	}

	return columnsCode;
};

const generateFilterFieldsCode = (
	table: TableBuilder["table"],
	settings: TableBuilder["settings"],
): string => {
	if (!settings.isGlobalSearch) return "";
	const generatedFields = generateFilterFields(
		table.columns,
		table.data as JsonData[],
	);
	console.log("temp", generatedFields);
	const fieldsCode = generatedFields
		.map(
			(field) =>
				`{ ${Object.entries(field)
					.map(([k, v]) => `${k}: ${toJSLiteral(v)}`)
					.join(", ")} }`,
		)
		.join(",\n\t\t\t\t");
	return `
		const filterFields = useMemo<FilterFieldConfig[]>(() => [
			${fieldsCode}
		], []);`;
};

export const generateTableCode = (
	tableBuilder: TableBuilder,
	customName?: string,
): { file: string; code: string } => {
	const componentName = getComponentName(tableBuilder, customName);
	const dataName = getDataName(customName);
	const typeName = getTypeName(customName);
	const settings = tableBuilder.settings;
	const table = tableBuilder.table;

	// Check if there are any array columns
	const hasArrayColumns = table.columns.some((col) => col.type === "array");

	let imports = `import { useState, useCallback, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataGrid, DataGridContainer, DataGridTable, DataGridPagination, DataGridColumnHeader, DataGridTableRowSelectAll, DataGridTableRowSelect } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import type { PaginationState, SortingState } from "@/types/table-types";
`;

	if (settings.isGlobalSearch) {
		imports += `import { Button } from "@/components/ui/button";
import { FunnelX } from "lucide-react";
import { Filters } from "@/components/ui/filters";
import { applyFilters } from "@/lib/table-generator/generate-columns";
import type { Filter, FilterFieldConfig } from "@/components/ui/filters";
`;
	}

	if (hasArrayColumns) {
		imports += `import { Badge } from "@/components/ui/badge";
`;
	}

	let code = `${imports}export default function ${componentName}() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
`;

	if (settings.isGlobalSearch) {
		code += "\tconst [filters, setFilters] = useState<Filter[]>([]);\n";
	}

	if (hasArrayColumns) {
		code +=
			"\tconst [expandedArrayRows, setExpandedArrayRows] = useState<Set<string>>(new Set());\n";
		code +=
			"\tconst handleToggleArrayExpand = useCallback((columnId: string, rowId: string) => {\n";
		code += "\t\tsetExpandedArrayRows((prev) => {\n";
		code += "\t\t\tconst newSet = new Set(prev);\n";
		code += "\t\t\tif (newSet.has(rowId)) {\n";
		code += "\t\t\t\tnewSet.delete(rowId);\n";
		code += "\t\t\t} else {\n";
		code += "\t\t\t\tnewSet.add(rowId);\n";
		code += "\t\t\t}\n";
		code += "\t\t\treturn newSet;\n";
		code += "\t\t});\n";
		code += "\t}, []);\n";
	}

	code +=
		"\n\t" +
		generateColumnsCode(table, settings, typeName, hasArrayColumns) +
		"\n";

	if (settings.isGlobalSearch) {
		code += "\n\t" + generateFilterFieldsCode(table, settings) + "\n";
		code += "\t// Apply filters to data\n";
		code += "\tconst filteredData = useMemo(() => {\n";
		code +=
			"\t\treturn applyFilters(" +
			toCamelCase(dataName) +
			", filters, " +
			toCamelCase(dataName) +
			"Columns);\n";
		code +=
			"\t}, [filters, " +
			toCamelCase(dataName) +
			", " +
			toCamelCase(dataName) +
			"Columns]);\n";
		code += "\n";
		code +=
			"\tconst handleFiltersChange = useCallback((filters: Filter[]) => {\n";
		code += '\t\tconsole.log("Filters updated:", filters);\n';
		code += "\t\tsetFilters(filters);\n";
		code += "\t\tsetPagination((prev) => ({ ...prev, pageIndex: 0 }));\n";
		code += "\t}, []);\n";
	}
	code += "\n";
	code += "\tconst table = useReactTable({\n";
	code += "\t\tcolumns,\n";
	code +=
		"\t\tdata: " +
		(settings.isGlobalSearch ? "filteredData" : toCamelCase(dataName)) +
		",\n";
	code +=
		"\t\tpageCount: Math.ceil((" +
		(settings.isGlobalSearch ? "filteredData" : toCamelCase(dataName)) +
		"?.length || 0) / pagination.pageSize),\n";
	code += "\t\tstate: {\n";
	code += "\t\t\tpagination,\n";
	code += "\t\t\tsorting,\n";
	code += "\t\t},\n";
	code += "\t\tonPaginationChange: setPagination,\n";
	code += "\t\tonSortingChange: setSorting,\n";
	code += "\t\tgetCoreRowModel: getCoreRowModel(),\n";
	code += "\t\tgetPaginationRowModel: getPaginationRowModel(),\n";
	code += "\t\tgetSortedRowModel: getSortedRowModel(),\n";
	code += "\t});\n";
	code += "\n";
	code += "\treturn (\n";
	code +=
		"\t\t<DataGrid table={table} recordCount={" +
		(settings.isGlobalSearch ? "filteredData" : toCamelCase(dataName)) +
		"?.length || 0}" +
		generateTableLayoutProps(settings.tableLayout) +
		">\n";
	code += '\t\t\t<div className="w-full space-y-2.5">\n';

	if (settings.isGlobalSearch) {
		code += "\t\t\t<Filters\n";
		code += "\t\t\t\tfilters={filters}\n";
		code += "\t\t\t\tfields={filterFields}\n";
		code += '\t\t\t\tvariant="outline"\n';
		code += "\t\t\t\tonChange={handleFiltersChange}\n";
		code += "\t\t\t/>\n";
		code += "\t\t\t{filters.length > 0 && (\n";
		code +=
			'\t\t\t\t<Button variant="outline" onClick={() => setFilters([])}>\n';
		code += "\t\t\t\t\t<FunnelX /> Clear\n";
		code += "\t\t\t\t</Button>\n";
		code += "\t\t\t)}\n";
	}

	code += "\t\t\t\t<DataGridContainer>\n";
	code += "\t\t\t\t\t<ScrollArea>\n";
	code += "\t\t\t\t\t\t<DataGridTable />\n";
	code += '\t\t\t\t\t\t<ScrollBar orientation="horizontal" />\n';
	code += "\t\t\t\t\t</ScrollArea>\n";
	code += "\t\t\t\t</DataGridContainer>\n";
	code +=
		"\t\t\t\t" +
		(settings.enablePagination ? "<DataGridPagination />" : "") +
		"\n";
	code += "\t\t\t</div>\n";
	code += "\t\t</DataGrid>\n";
	code += "\t);\n";
	code += "};\n";

	const componentCodeWithImport = `import { ${toCamelCase(dataName)} } from './data';
${code}`;

	return {
		file: `${componentName.toLowerCase()}.tsx`,
		code: componentCodeWithImport,
	};
};
