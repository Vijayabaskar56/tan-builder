import {
	tableBuilderCollection,
	type TableBuilder,
} from "@/db-collections/table-builder.collections";
import { tableTemplates } from "@/constants/table-templates";
import type { ColumnConfig, DataRow } from "@/types/table-types";
import { detectColumns } from "@/lib/table-generator/generate-columns";
import { getStaticData } from "@/constants/static-dummy-data";

/**
 * Centralized service for all table builder operations
 * Provides consistent error handling, validation, and API for table operations
 */
export class TableBuilderService {
	private static readonly TABLE_ID = 1;

	// ============================================================================
	// Query Operations
	// ============================================================================

	/**
	 * Get the current table data and settings
	 */
	static getTableData(): TableBuilder | null {
		try {
			return tableBuilderCollection.get(this.TABLE_ID) || null;
		} catch (error) {
			console.error("Failed to get table data:", error);
			return null;
		}
	}

	/**
	 * Get table settings only
	 */
	static getSettings() {
		try {
			const data = this.getTableData();
			return data?.settings || null;
		} catch (error) {
			console.error("Failed to get table settings:", error);
			return null;
		}
	}

	/**
	 * Get table columns only
	 */
	static getColumns(): ColumnConfig[] {
		try {
			const data = this.getTableData();
			return data?.table.columns || [];
		} catch (error) {
			console.error("Failed to get table columns:", error);
			return [];
		}
	}

	/**
	 * Get table data rows only
	 */
	static getData(): DataRow[] {
		try {
			const data = this.getTableData();
			return data?.table.data || [];
		} catch (error) {
			console.error("Failed to get table data:", error);
			return [];
		}
	}

	// ============================================================================
	// Settings Operations
	// ============================================================================

	/**
	 * Update a single setting
	 */
	static updateSetting(
		key: keyof TableBuilder["settings"],
		value: boolean,
	): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				if (!draft.settings) {
					draft.settings = {
						isGlobalSearch: false,
						enableHiding: false,
						enableSorting: false,
						enableResizing: false,
						enablePinning: false,
						enableRowSelection: false,
						enableRowActions: false,
						enableDraggable: false,
						enablePagination: false,
					};
				}
				(draft.settings as any)[key] = value;
			});
			return true;
		} catch (error) {
			console.error(`Failed to update setting ${key}:`, error);
			return false;
		}
	}

	/**
	 * Update multiple settings at once
	 */
	static updateSettings(settings: Partial<TableBuilder["settings"]>): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				if (!draft.settings) {
					draft.settings = {
						isGlobalSearch: false,
						enableHiding: false,
						enableSorting: false,
						enableResizing: false,
						enablePinning: false,
						enableRowSelection: false,
						enableRowActions: false,
						enableDraggable: false,
						enablePagination: false,
					};
				}
				Object.assign(draft.settings, settings);
			});
			return true;
		} catch (error) {
			console.error("Failed to update settings:", error);
			return false;
		}
	}

	/**
	 * Reset settings to defaults
	 */
	static resetSettings(): boolean {
		try {
			return this.updateSettings({
				isGlobalSearch: true,
				enableHiding: true,
				enableSorting: true,
				enableResizing: true,
				enablePinning: true,
				enableRowSelection: false,
				enableRowActions: false,
				enableDraggable: false,
				enablePagination: true,
			});
		} catch (error) {
			console.error("Failed to reset settings:", error);
			return false;
		}
	}

	// ============================================================================
	// Column Operations
	// ============================================================================

	/**
	 * Add a new column to the table
	 */
	static addColumn(type: ColumnConfig["type"]): boolean {
		try {
			const columnKey = `column_${Date.now()}`;
			const columns = this.getColumns();
			const newColumn: ColumnConfig = {
				id: columnKey,
				accessor: columnKey,
				label: `Column ${columns.length + 1}`,
				type,
				order: columns.length,
				filterable: type === "string",
			};

			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table.columns.push(newColumn);

				// Ensure exactly 20 rows exist
				const currentDataLength = draft.table.data.length;
				const allColumns = draft.table.columns;

				if (currentDataLength === 0) {
					// No existing data, create 20 rows
					const newData = [];
					for (let i = 0; i < 20; i++) {
						const row: DataRow = {};
						for (const col of allColumns) {
							row[col.id] = getStaticData(col.type, i);
						}
						newData.push(row);
					}
					draft.table.data = newData;
				} else if (currentDataLength < 20) {
					// Add rows to reach exactly 20
					const rowsToAdd = 20 - currentDataLength;
					for (let i = 0; i < rowsToAdd; i++) {
						const row: DataRow = {};
						for (const col of allColumns) {
							row[col.id] = getStaticData(col.type, currentDataLength + i);
						}
						draft.table.data.push(row);
					}
					// Add data to existing rows for the new column
					for (let i = 0; i < currentDataLength; i++) {
						draft.table.data[i]![columnKey] = getStaticData(newColumn.type, i);
					}
				} else {
					// Add data to existing rows for the new column
					for (let i = 0; i < 20; i++) {
						draft.table.data[i]![columnKey] = getStaticData(newColumn.type, i);
					}
				}
			});
			return true;
		} catch (error) {
			console.error("Failed to add column:", error);
			return false;
		}
	}

	/**
	 * Update an existing column
	 */
	static updateColumn(
		columnId: string,
		updates: Partial<ColumnConfig>,
	): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				const columnIndex = draft.table.columns.findIndex(
					(col) => col.id === columnId,
				);
				if (columnIndex !== -1) {
					draft.table.columns[columnIndex] = {
						...draft.table.columns[columnIndex],
						...updates,
					};
				} else {
					throw new Error(`Column with id ${columnId} not found`);
				}
			});
			return true;
		} catch (error) {
			console.error(`Failed to update column ${columnId}:`, error);
			return false;
		}
	}

	/**
	 * Delete a column from the table
	 */
	static deleteColumn(columnId: string): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table.columns = draft.table.columns.filter(
					(col) => col.id !== columnId,
				);
				// Remove column data from all rows
				for (const row of draft.table.data) {
					delete row[columnId];
				}
			});
			return true;
		} catch (error) {
			console.error(`Failed to delete column ${columnId}:`, error);
			return false;
		}
	}

	/**
	 * Reorder columns
	 */
	static reorderColumns(newOrder: ColumnConfig[]): boolean {
		try {
			// Update order property for each column
			const reorderedColumns = newOrder.map((col, index) => ({
				...col,
				order: index,
			}));

			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table.columns = reorderedColumns;
			});
			return true;
		} catch (error) {
			console.error("Failed to reorder columns:", error);
			return false;
		}
	}

	// ============================================================================
	// Data Operations
	// ============================================================================

	/**
	 * Import data and automatically detect columns
	 */
	static async importData(data: DataRow[]): Promise<boolean> {
		try {
			if (!Array.isArray(data) || data.length === 0) {
				throw new Error("Invalid data: must be a non-empty array");
			}

			const columns = detectColumns(data);
			await tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table = {
					columns,
					data,
				};
			});
			return true;
		} catch (error) {
			console.error("Failed to import data:", error);
			return false;
		}
	}

	/**
	 * Clear all data but keep columns
	 */
	static clearData(): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table.data = [];
			});
			return true;
		} catch (error) {
			console.error("Failed to clear data:", error);
			return false;
		}
	}

	/**
	 * Reset the entire table (clear columns and data)
	 */
	static resetTable(): boolean {
		try {
			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.table = { data: [], columns: [] };
			});
			return true;
		} catch (error) {
			console.error("Failed to reset table:", error);
			return false;
		}
	}

	// ============================================================================
	// Template Operations
	// ============================================================================

	/**
	 * Apply a template to the table
	 */
	static applyTemplate(templateKey: string): boolean {
		try {
			const template = tableTemplates[templateKey];
			if (!template) {
				throw new Error(`Template ${templateKey} not found`);
			}

			tableBuilderCollection.update(this.TABLE_ID, (draft) => {
				draft.settings = template.settings;
				draft.table = {
					columns: template.columns,
					data: template.sampleData || [],
				};
			});
			return true;
		} catch (error) {
			console.error(`Failed to apply template ${templateKey}:`, error);
			return false;
		}
	}

	// ============================================================================
	// Initialization
	// ============================================================================

	/**
	 * Initialize the table store with defaults
	 */
	static initializeTable(): boolean {
		try {
			if (typeof window === "undefined") {
				return false;
			}

			// Clear old data to force re-initialization with new schema
			localStorage.removeItem("table-builder");

			const existing = tableBuilderCollection.get(this.TABLE_ID);
			if (!existing) {
				const defaultSettings = {
					isGlobalSearch: true,
					enableHiding: true,
					enableSorting: true,
					enableResizing: true,
					enablePinning: true,
					enableRowSelection: false,
					enableRowActions: false,
					enableDraggable: false,
					enablePagination: true,
				};

				tableBuilderCollection.insert([
					{
						id: this.TABLE_ID,
						settings: defaultSettings,
						table: {
							columns: [],
							data: [],
						},
					},
				]);
			}
			return true;
		} catch (error) {
			console.error("Failed to initialize table:", error);
			return false;
		}
	}

	// ============================================================================
	// Utility Methods
	// ============================================================================
}
