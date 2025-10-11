import {
	Calendar,
	CheckSquare,
	Grid3X3,
	Hash,
	Heading1,
	Heading2,
	Heading3,
	ListChecks,
	Shield,
	Type,
} from "lucide-react";

/**
 * used in
 * - form-elements-selector.tsx
 * - form-elements-selector-command.tsx
 */
export const formElementsList = [
	{
		group: "field",
		name: "Checkbox",
		fieldType: "Checkbox",
		icon: CheckSquare,
	},
	{
		group: "field",
		name: "Date Picker",
		fieldType: "DatePicker",
		icon: Calendar,
	},
	{
		group: "display",
		name: "Heading 1",
		fieldType: "H1",
		content: "Heading 1",
		icon: Heading1,
		static: true,
	},
	{
		group: "display",
		name: "Heading 2",
		fieldType: "H2",
		content: "Heading 2",
		icon: Heading2,
		static: true,
	},
	{
		group: "display",
		name: "Heading 3",
		fieldType: "H3",
		content: "Heading 3",
		icon: Heading3,
		static: true,
	},

	{
		group: "display",
		name: "Description",
		fieldType: "FieldDescription",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		icon: Type,
		static: true,
	},
	{
		group: "display",
		name: "Legend",
		fieldType: "FieldLegend",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		icon: Type,
		static: true,
	},
	{
		group: "field",
		name: "Input",
		fieldType: "Input",
		icon: Type,
	},
	{
		group: "field",
		name: "Input OTP",
		fieldType: "OTP",
		icon: Shield,
	},
	{
		group: "field",
		name: "Multi select",
		fieldType: "MultiSelect",
		icon: ListChecks,
		options: [
			{
				value: "1",
				label: "Option 1",
			},
			{
				value: "2",
				label: "Option 2",
			},
			{
				value: "3",
				label: "Option 3",
			},
			{
				value: "4",
				label: "Option 4",
			},
			{
				value: "5",
				label: "Option 5",
			},
		],
	},
];

/**
 * Table column types for adding columns
 */
export const tableColumnTypes = [
	{
		name: "String",
		type: "string",
		icon: Type,
	},
	{
		name: "Number",
		type: "number",
		icon: Hash,
	},
	{
		name: "Boolean",
		type: "boolean",
		icon: CheckSquare,
	},
	{
		name: "Date",
		type: "date",
		icon: Calendar,
	},
	{
		name: "Object",
		type: "object",
		icon: Grid3X3,
	},
];
