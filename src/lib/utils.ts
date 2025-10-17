import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { type ClassValue, clsx } from "clsx";
import js_beautify from "js-beautify";
import { twMerge } from "tailwind-merge";
import {
	type SettingsCollection,
	settingsCollection,
} from "@/db-collections/settings.collections";
import type { ColumnConfig, JsonData } from "@/types/table-types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isStatic = (fieldType: string) => {
	return [
		"Separator",
		"H1",
		"H2",
		"H3",
		"FieldDescription",
		"FieldLegend",
	].includes(fieldType);
};

export function toPascalCase(str: string): string {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
			index === 0 ? word.toUpperCase() : word.toUpperCase(),
		)
		.replace(/\s+/g, "");
}

export function toCamelCase(str: string): string {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
			index === 0 ? word.toLowerCase() : word.toUpperCase(),
		)
		.replace(/\s+/g, "");
}

export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}

export function generateFormNames(formName: string) {
	const pascal = toPascalCase(formName);
	const camel = toCamelCase(formName);
	const kebab = toKebabCase(formName);

	return {
		componentName: `${pascal}Form`,
		variableName: `${camel}Form`,
		schemaName: `${camel}FormSchema`,
		schemaFileName: `${kebab}-form-schema`,
	};
}

export function formatCode(code: string): string {
	// Split code into lines
	const lines = code.split("\n");
	const importLines: string[] = [];
	const nonImportLines: string[] = [];

	// Separate imports from other code
	let currentImport = "";
	let inImport = false;

	for (const line of lines) {
		const trimmedLine = line.trim();

		// Check if line starts an import
		if (trimmedLine.startsWith("import ") && trimmedLine.includes("{")) {
			inImport = true;
			currentImport = trimmedLine;

			// If import is complete on one line
			if (trimmedLine.includes("}") && trimmedLine.includes("from")) {
				// Clean up single-line import
				const cleanImport = currentImport.replace(/\s+/g, " ").trim();
				importLines.push(cleanImport);
				currentImport = "";
				inImport = false;
			}
		} else if (inImport) {
			// Continue building multi-line import
			currentImport += ` ${trimmedLine}`;

			// Check if import is complete
			if (trimmedLine.includes("}") && currentImport.includes("from")) {
				// Clean up multi-line import to single line
				const cleanImport = currentImport
					.replace(/\s*\n\s*/g, " ")
					.replace(/\s+/g, " ")
					.replace(/\{\s+/g, "{ ")
					.replace(/\s+\}/g, " }")
					.trim();
				importLines.push(cleanImport);
				currentImport = "";
				inImport = false;
			}
		} else if (trimmedLine.startsWith("import ")) {
			// Handle other types of imports (default imports, etc.)
			importLines.push(trimmedLine);
		} else if (/^["']use (client|server)["']/.test(trimmedLine)) {
			// Handle use client directive
			importLines.push(trimmedLine);
		} else {
			// Regular code line
			nonImportLines.push(line);
		}
	}

	// Format only the non-import code with js_beautify
	const nonImportCode = nonImportLines.join("\n");
	const formattedNonImportCode = js_beautify(nonImportCode, {
		indent_size: 2,
		indent_char: " ",
		max_preserve_newlines: 1,
		preserve_newlines: false,
		keep_array_indentation: false,
		break_chained_methods: false,
		brace_style: "collapse",
		space_before_conditional: true,
		unescape_strings: false,
		jslint_happy: false,
		end_with_newline: false,
		wrap_line_length: 0,
		comma_first: false,
		e4x: true,
		indent_empty_lines: false,
	});

	// Combine imports and formatted code
	const result = [...importLines, "", ...formattedNonImportCode.split("\n")]
		.filter((line, index, arr) => {
			// Remove excessive empty lines
			if (line.trim() === "") {
				return index === 0 || arr[index - 1]?.trim() !== "";
			}
			return true;
		})
		.join("\n");

	return result;
}

export const updatePreferredPackageManager = createClientOnlyFn(
	(value: SettingsCollection["preferredPackageManager"]) => {
		settingsCollection?.update("user-settings", (draft: SettingsCollection) => {
			draft.preferredPackageManager = value;
		});
	},
);

export const logger = createIsomorphicFn()
	.server((msg: string, data?: any) => console.log(`[SERVER]: ${msg}`, data))
	.client((msg: string, data?: any) => {
		if (import.meta.env.DEV) {
			console.log(`[CLIENT]: ${msg}`, data);
		}
	});

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
		// Sample a few rows to get better type detection
		const sampleValues = data
			.slice(0, Math.min(5, data.length))
			.map((row) => row[key]);
		const types = sampleValues.map(detectColumnType);
		const mostCommonType = types.reduce((a, b, _, arr) =>
			arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
				? a
				: b,
		);

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
