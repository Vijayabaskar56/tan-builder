import { describe, expect, it } from 'vitest';
import { extractTableImportDependencies, generateTableImports } from '@/lib/table-code-generators/react/generate-imports';

describe('generateTableImports', () => {
	it('should generate correct imports for all settings enabled', () => {
		const settings = {
			isGlobalSearch: true,
			enableHiding: true,
			enableSorting: true,
			enableResizing: true,
			enablePinning: true,
			enableRowSelection: true,
			enableCRUD: true,
			enableColumnDragging: false,
			enableRowDragging: false,
			enablePagination: true,
			tableLayout: {
				dense: false,
				cellBorder: false,
				rowBorder: true,
				rowRounded: false,
				stripped: false,
				headerBorder: true,
				headerSticky: false,
				width: "fixed" as const,
			},
		};

		const result = generateTableImports(settings);

		expect(result).toContain('import { useMemo, useState } from "react"');
		expect(result).toContain('import {\n\ttype ColumnDef,\n\tgetCoreRowModel,\n\tgetFilteredRowModel,\n\tgetPaginationRowModel,\n\tgetSortedRowModel,\n\ttype PaginationState,\n\ttype SortingState,\n\tuseReactTable,\n} from "@tanstack/react-table"');
		expect(result).toContain('import { DataGrid, DataGridContainer } from "@/components/ui/data-grid"');
		expect(result).toContain('import { DataGridPagination } from "@/components/ui/data-grid-pagination"');
		expect(result).toContain('import {\n\tDataGridTableRowSelect,\n\tDataGridTableRowSelectAll,\n} from "@/components/ui/data-grid-table"');
		expect(result).toContain('import { EllipsisIcon } from "lucide-react"');
		expect(result).toContain('import { Filters } from "@/components/ui/filters"');
	});

	it('should generate minimal imports when no settings enabled', () => {
		const settings = {
			isGlobalSearch: false,
			enableHiding: false,
			enableSorting: false,
			enableResizing: false,
			enablePinning: false,
			enableRowSelection: false,
			enableCRUD: false,
			enableColumnDragging: false,
			enableRowDragging: false,
			enablePagination: false,
			tableLayout: {
				dense: false,
				cellBorder: false,
				rowBorder: true,
				rowRounded: false,
				stripped: false,
				headerBorder: true,
				headerSticky: false,
				width: "fixed" as const,
			},
		};

		const result = generateTableImports(settings);

		expect(result).toContain('import { useMemo, useState } from "react"');
		expect(result).toContain('import { DataGrid, DataGridContainer } from "@/components/ui/data-grid"');
		expect(result).not.toContain('import { DataGridPagination }');
		expect(result).not.toContain('import { Filters }');
	});
});

describe('extractTableImportDependencies', () => {
	it('should extract registry dependencies and dependencies correctly', () => {
		const importSet = new Set([
			'import { DataGrid } from "@/components/ui/data-grid"',
			'import { Button } from "@/components/ui/button"',
			'import { toast } from "sonner"',
			'import { useReactTable } from "@tanstack/react-table"',
			'import { EllipsisIcon } from "lucide-react"',
		]);

		const result = extractTableImportDependencies(importSet);

		expect(result.registryDependencies).toEqual(['data-grid', 'button']);
		expect(result.dependencies).toEqual(['sonner', '@tanstack/react-table', 'lucide-react']);
	});

	it('should handle empty import set', () => {
		const importSet = new Set<string>();

		const result = extractTableImportDependencies(importSet);

		expect(result.registryDependencies).toEqual([]);
		expect(result.dependencies).toEqual([]);
	});
});