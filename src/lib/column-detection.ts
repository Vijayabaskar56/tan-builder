import type { Column } from "@/workers/data-processor.worker";
import type { ColumnConfig, JsonData } from "@/types/table-types";

export const detectColumnType = (
	value: string | number | boolean | null | undefined | object,
): "string" | "number" | "boolean" | "date" | "object" => {
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

export const detectColumns = (data: JsonData[]): Column[] => {
	if (data.length === 0) return [];

	const firstRow = data[0];
	const detectedColumns: Column[] = [];

	Object.keys(firstRow).forEach((key, index) => {
		// Sample all rows for accurate type detection
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

export const detectColumnsConfig = (data: JsonData[]): ColumnConfig[] => {
	const columns = detectColumns(data);
	return columns.map((col) => ({
		...col,
		filterable: true,
		hasFacetedFilter: false,
		options: undefined,
		optionsMode: "auto" as const,
	}));
};
