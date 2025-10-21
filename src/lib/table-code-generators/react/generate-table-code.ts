import type { TableBuilder } from "@/db-collections/table-builder.collections";
import { generateFilterFields } from "@/lib/table-generator/generate-columns";
import { toJSLiteral } from "@/lib/utils";
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
): string => {
	const columnDefs = table.columns.map((col) =>
		generateColumnDef(col, settings),
	);

	let columnsCode = `const columns = useMemo<ColumnDef<${typeName}>[]>(
			() => [
				${columnDefs.join(",\n\t\t\t\t")}
			],
			[],
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
			[],
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

	let code = `export default function ${componentName}() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
`;

	if (settings.isGlobalSearch) {
		code += `	const [filters, setFilters] = useState<Filter[]>([]);
`;
	}

	code += `
	${generateColumnsCode(table, settings, typeName)}
`;

	if (settings.isGlobalSearch) {
		code += `
	${generateFilterFieldsCode(table, settings)}

	// Apply filters to data - only apply filters with non-empty values
	const filteredData = useMemo(() => {
		let filtered = [...${dataName}];

		// Filter out empty filters before applying
		const activeFilters = filters.filter((filter) => {
			const { values } = filter;

			// Check if filter has meaningful values
			if (!values || values.length === 0) return false;

			// For text/string values, check if they're not empty strings
			if (
				values.every(
					(value) => typeof value === "string" && value.trim() === "",
				)
			)
				return false;

			// For number values, check if they're not null/undefined
			if (values.every((value) => value === null || value === undefined))
				return false;

			// For arrays, check if they're not empty
			if (values.every((value) => Array.isArray(value) && value.length === 0))
				return false;

			return true;
		});

		activeFilters.forEach((filter) => {
			const { field, operator, values } = filter;

			filtered = filtered.filter((item) => {
				const fieldValue = item[field as keyof typeof ${dataName}[0]];

				switch (operator) {
					case "is":
						return values.includes(fieldValue);
					case "is_not":
						return !values.includes(fieldValue);
					case "contains":
						return values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "not_contains":
						return !values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "equals":
						return fieldValue === values[0];
					case "not_equals":
						return fieldValue !== values[0];
					case "greater_than":
						return Number(fieldValue) > Number(values[0]);
					case "less_than":
						return Number(fieldValue) < Number(values[0]);
					case "greater_than_or_equal":
						return Number(fieldValue) >= Number(values[0]);
					case "less_than_or_equal":
						return Number(fieldValue) <= Number(values[0]);
					case "between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) >= min && Number(fieldValue) <= max;
						}
						return true;
					case "not_between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) < min || Number(fieldValue) > max;
						}
						return true;
					case "before":
						return new Date(String(fieldValue)) < new Date(String(values[0]));
					case "after":
						return new Date(String(fieldValue)) > new Date(String(values[0]));
					default:
						return true;
				}
			});
		});

		return filtered;
	}, [filters]);

	const handleFiltersChange = useCallback((filters: Filter[]) => {
		console.log("Filters updated:", filters);
		setFilters(filters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);
`;
	}

	code += `
	const table = useReactTable({
		columns,
		data: ${settings.isGlobalSearch ? "filteredData" : dataName},
		pageCount: Math.ceil((${settings.isGlobalSearch ? "filteredData" : dataName}?.length || 0) / pagination.pageSize),
		state: {
			pagination,
			sorting,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<DataGrid table={table} recordCount={${settings.isGlobalSearch ? "filteredData" : dataName}?.length || 0}${generateTableLayoutProps(settings.tableLayout)}>
			<div className="w-full space-y-2.5">
				${
					settings.isGlobalSearch
						? `<Filters
					filters={filters}
					fields={filterFields}
					variant="outline"
					onChange={handleFiltersChange}
				/>`
						: ""
				}
				<DataGridContainer>
					<ScrollArea>
						<DataGridTable />
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</DataGridContainer>
				${settings.enablePagination ? `<DataGridPagination />` : ""}
			</div>
		</DataGrid>
	);
}`;

	return {
		file: `${componentName.toLowerCase()}.tsx`,
		code,
	};
};
