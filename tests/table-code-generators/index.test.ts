import { describe, expect, it } from 'vitest';
import { generateTable } from '@/lib/table-code-generators/react/index';

describe('generateTable', () => {
	it('should generate complete table code', () => {
		const tableBuilder = {
			id: 1,
			settings: {
				isGlobalSearch: true,
				enableHiding: true,
				enableSorting: true,
				enableResizing: false,
				enablePinning: false,
				enableRowSelection: true,
				enableCRUD: true,
				enableColumnDragging: false,
				enableRowDragging: false,
				enablePagination: true,
				tableLayout: {
					dense: true,
					cellBorder: false,
					rowBorder: true,
					rowRounded: false,
					stripped: false,
					headerBorder: true,
					headerSticky: false,
					width: "fixed" as const,
				},
			},
			table: {
				columns: [
					{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
					{ id: 'age', accessor: 'age', label: 'Age', type: 'number' as const, order: 2, filterable: true },
				],
				data: [
					{ name: 'John', age: 30 },
					{ name: 'Jane', age: 25 },
				],
			},
		};

		const result = generateTable(tableBuilder, 'UserTable');

		expect(result.file).toBe('usertable.tsx');
		expect(result.code).toContain('"use client";');
		expect(result.code).toContain('import { useMemo, useState } from "react"');
		expect(result.code).toContain('export interface UserTableData');
		expect(result.code).toContain('export const UserTableData: UserTableData[]');
		expect(result.code).toContain('export default function UserTable()');
		expect(result.code).toContain('name: "John"');
		expect(result.code).toContain('age: 30');
		expect(result.dependencies.registryDependencies).toContain('data-grid');
		expect(result.dependencies.dependencies).toContain('react');
	});

	it('should handle minimal settings', () => {
		const tableBuilder = {
			id: 2,
			settings: {
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
			},
			table: {
				columns: [
					{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: false },
				],
				data: [{ name: 'Test' }],
			},
		};

		const result = generateTable(tableBuilder);

		expect(result.code).not.toContain('Filters');
		expect(result.code).not.toContain('DataGridPagination');
		expect(result.code).toContain('TableComponent2');
		expect(result.code).toContain('name: "Test"');
	});
});