import type { ColumnConfig, DataRow } from "@/types/table-types";

export interface TableTemplate {
	name: string;
	description: string;
	columns: ColumnConfig[];
	sampleData?: DataRow[];
	settings: {
		isGlobalSearch?: boolean;
		enableHiding?: boolean;
		enableSorting?: boolean;
		enableResizing?: boolean;
		enablePinning?: boolean;
		enableRowSelection?: boolean;
		enableRowActions?: boolean;
		enableDraggable?: boolean;
	};
}

export const tableTemplates: Record<string, TableTemplate> = {
	basicTable: {
		name: "Basic Table",
		description: "A simple table with data only, no additional features",
		columns: [
			{
				id: "id",
				accessor: "id",
				label: "ID",
				type: "number",
				order: 1,
			},
			{
				id: "name",
				accessor: "name",
				label: "Name",
				type: "string",
				order: 2,
			},
			{
				id: "value",
				accessor: "value",
				label: "Value",
				type: "number",
				order: 3,
			},
		],
		sampleData: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			name: `Item ${i + 1}`,
			value: Math.floor(Math.random() * 1000),
		})),
		settings: {
			isGlobalSearch: false,
			enableHiding: false,
			enableSorting: false,
			enableResizing: false,
			enablePinning: false,
			enableRowSelection: false,
			enableRowActions: false,
			enableDraggable: false,
		},
	},
	rowSelectionTable: {
		name: "Table with Row Selection",
		description: "A table with row selection enabled",
		columns: [
			{
				id: "id",
				accessor: "id",
				label: "ID",
				type: "number",
				order: 1,
			},
			{
				id: "name",
				accessor: "name",
				label: "Name",
				type: "string",
				order: 2,
			},
			{
				id: "status",
				accessor: "status",
				label: "Status",
				type: "string",
				order: 3,
				hasFacetedFilter: true,
			},
		],
		sampleData: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			name: `Item ${i + 1}`,
			status: ["Active", "Inactive"][i % 2],
		})),
		settings: {
			isGlobalSearch: true,
			enableHiding: true,
			enableSorting: true,
			enableResizing: true,
			enablePinning: true,
			enableRowSelection: true,
			enableRowActions: false,
			enableDraggable: false,
		},
	},
	filtersTable: {
		name: "Data Table with Filters",
		description: "A table with advanced filtering capabilities",
		columns: [
			{
				id: "id",
				accessor: "id",
				label: "ID",
				type: "number",
				order: 1,
			},
			{
				id: "category",
				accessor: "category",
				label: "Category",
				type: "string",
				order: 2,
				hasFacetedFilter: true,
			},
			{
				id: "priority",
				accessor: "priority",
				label: "Priority",
				type: "string",
				order: 3,
				hasFacetedFilter: true,
			},
			{
				id: "date",
				accessor: "date",
				label: "Date",
				type: "date",
				order: 4,
			},
		],
		sampleData: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			category: ["A", "B", "C"][i % 3],
			priority: ["High", "Medium", "Low"][i % 3],
			date: `2023-01-${String(i + 1).padStart(2, "0")}`,
		})),
		settings: {
			isGlobalSearch: true,
			enableHiding: true,
			enableSorting: true,
			enableResizing: true,
			enablePinning: true,
			enableRowSelection: false,
			enableRowActions: false,
			enableDraggable: false,
		},
	},
	resizableSortableTable: {
		name: "Resizable and Sortable Columns",
		description: "A table with resizable and sortable columns",
		columns: [
			{
				id: "id",
				accessor: "id",
				label: "ID",
				type: "number",
				order: 1,
			},
			{
				id: "name",
				accessor: "name",
				label: "Name",
				type: "string",
				order: 2,
			},
			{
				id: "score",
				accessor: "score",
				label: "Score",
				type: "number",
				order: 3,
			},
			{
				id: "active",
				accessor: "active",
				label: "Active",
				type: "boolean",
				order: 4,
			},
		],
		sampleData: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			name: `Item ${i + 1}`,
			score: Math.floor(Math.random() * 100),
			active: i % 2 === 0,
		})),
		settings: {
			isGlobalSearch: true,
			enableHiding: true,
			enableSorting: true,
			enableResizing: true,
			enablePinning: false,
			enableRowSelection: false,
			enableRowActions: false,
			enableDraggable: true,
		},
	},
	complexTable: {
		name: "Complex Data Table",
		description: "A full-featured table with all capabilities enabled",
		columns: [
			{
				id: "id",
				accessor: "id",
				label: "ID",
				type: "number",
				order: 1,
			},
			{
				id: "name",
				accessor: "name",
				label: "Name",
				type: "string",
				order: 2,
				hasFacetedFilter: true,
			},
			{
				id: "category",
				accessor: "category",
				label: "Category",
				type: "string",
				order: 3,
				hasFacetedFilter: true,
			},
			{
				id: "price",
				accessor: "price",
				label: "Price",
				type: "number",
				order: 4,
			},
			{
				id: "date",
				accessor: "date",
				label: "Date",
				type: "date",
				order: 5,
			},
			{
				id: "active",
				accessor: "active",
				label: "Active",
				type: "boolean",
				order: 6,
			},
		],
		sampleData: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			name: `Item ${i + 1}`,
			category: ["Electronics", "Books", "Clothing"][i % 3],
			price: Math.round((Math.random() * 100 + 10) * 100) / 100,
			date: `2023-01-${String(i + 1).padStart(2, "0")}`,
			active: i % 2 === 0,
		})),
		settings: {
			isGlobalSearch: true,
			enableHiding: true,
			enableSorting: true,
			enableResizing: true,
			enablePinning: true,
			enableRowSelection: true,
			enableRowActions: true,
			enableDraggable: true,
		},
	},
};
