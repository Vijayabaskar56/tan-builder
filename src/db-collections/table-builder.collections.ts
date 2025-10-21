import {
	createCollection,
	localOnlyCollectionOptions,
	localStorageCollectionOptions,
} from "@tanstack/react-db";
import * as v from "valibot";
import { settingsCollection } from "./settings.collections";

export const TableBuilderSchema = v.object({
	id: v.number(),
	settings: v.object({
		isGlobalSearch: v.optional(v.boolean(), false),
		enableHiding: v.optional(v.boolean(), false),
		enableSorting: v.optional(v.boolean(), false),
		enableResizing: v.optional(v.boolean(), false),
		enablePinning: v.optional(v.boolean(), false),
		enableRowSelection: v.optional(v.boolean(), false),
		enableCRUD: v.optional(v.boolean(), false),
		enableColumnDragging: v.optional(v.boolean(), false),
		enableRowDragging: v.optional(v.boolean(), false),
		enablePagination: v.optional(v.boolean(), false),
		tableLayout: v.optional(
			v.object({
				dense: v.optional(v.boolean(), false),
				cellBorder: v.optional(v.boolean(), false),
				rowBorder: v.optional(v.boolean(), true),
				rowRounded: v.optional(v.boolean(), false),
				stripped: v.optional(v.boolean(), false),
				headerBorder: v.optional(v.boolean(), true),
				headerSticky: v.optional(v.boolean(), false),
				width: v.optional(
					v.union([v.literal("auto"), v.literal("fixed")]),
					"fixed",
				),
			}),
			{},
		),
	}),
	table: v.object({
		columns: v.array(
			v.object({
				id: v.string(),
				accessor: v.string(),
				label: v.string(),
				type: v.union([
					v.literal("string"),
					v.literal("number"),
					v.literal("boolean"),
					v.literal("date"),
					v.literal("object"),
					v.literal("enum"),
				]),
				order: v.number(),
				filterable: v.optional(v.boolean(), false),
			}),
		),
		data: v.array(v.record(v.string(), v.any())),
	}),
});

export type TableBuilder = v.InferOutput<typeof TableBuilderSchema>;

export const tableBuilderCollection = createCollection(
	!settingsCollection.get("user-settings")?.autoSave
		? localStorageCollectionOptions({
				storageKey: "table-builder",
				getKey: (tableBuilder) => tableBuilder.id,
				schema: TableBuilderSchema,
				storage: window.localStorage,
			})
		: localOnlyCollectionOptions({
				getKey: (tableBuilder) => tableBuilder.id,
				schema: TableBuilderSchema,
			}),
);
