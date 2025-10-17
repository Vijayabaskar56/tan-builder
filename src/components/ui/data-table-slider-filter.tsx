import type { Column } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface DataTableSliderFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	unit?: string;
}

export function DataTableSliderFilter<TData, TValue>({
	column,
	title,
	unit = "",
}: DataTableSliderFilterProps<TData, TValue>) {
	const columnFilterValue = column?.getFilterValue() as
		| [number, number]
		| undefined;
	const [selectedRange, setSelectedRange] = React.useState<[number, number]>([
		0, 100,
	]);
	const [inputRange, setInputRange] = React.useState<[string, string]>([
		"",
		"",
	]);

	// Calculate range from data
	const range = React.useMemo(() => {
		const columnMeta = column?.columnDef.meta as
			| { range?: [number, number] }
			| undefined;
		if (columnMeta?.range) {
			return columnMeta.range;
		}

		// Calculate from table data
		const rows = (column as any)?.table?.getCoreRowModel().rows;
		if (!rows || rows.length === 0) return [0, 100];

		const accessorKey = (column as any)?.columnDef?.accessorKey as string;
		const numericValues = rows
			.map((row: any) => row.original[accessorKey])
			.filter(
				(val: any): val is number =>
					typeof val === "number" && !Number.isNaN(val),
			);

		if (numericValues.length === 0) return [0, 100];

		const min = Math.min(...numericValues);
		const max = Math.max(...numericValues);
		return [min, max];
	}, [column]);

	React.useEffect(() => {
		if (columnFilterValue) {
			setSelectedRange(columnFilterValue);
			setInputRange([
				String(columnFilterValue[0]),
				String(columnFilterValue[1]),
			]);
		} else {
			setSelectedRange([range[0], range[1]]);
			setInputRange([String(range[0]), String(range[1])]);
		}
	}, [columnFilterValue, range]);

	const handleSliderChange = (value: number[]) => {
		const newRange: [number, number] = [value[0] ?? 0, value[1] ?? 100];
		setSelectedRange(newRange);
		setInputRange([String(newRange[0]), String(newRange[1])]);

		// Only apply filter if range is different from full range
		if (newRange[0] === range[0] && newRange[1] === range[1]) {
			column?.setFilterValue(undefined);
		} else {
			column?.setFilterValue(newRange);
		}
	};

	const handleInputChange = (index: 0 | 1, value: string) => {
		const newInputRange: [string, string] = [inputRange[0], inputRange[1]];
		newInputRange[index] = value;
		setInputRange(newInputRange);
	};

	const handleInputBlur = () => {
		const min = Math.max(
			Number.parseFloat(inputRange[0]) || range[0],
			range[0],
		);
		const max = Math.min(
			Number.parseFloat(inputRange[1]) || range[1],
			range[1],
		);

		if (min <= max) {
			const newRange: [number, number] = [min, max];
			setSelectedRange(newRange);
			setInputRange([String(min), String(max)]);

			if (newRange[0] === range[0] && newRange[1] === range[1]) {
				column?.setFilterValue(undefined);
			} else {
				column?.setFilterValue(newRange);
			}
		} else {
			// Reset to current selected range if invalid
			setInputRange([String(selectedRange[0]), String(selectedRange[1])]);
		}
	};

	const handleReset = () => {
		setSelectedRange([range[0], range[1]]);
		setInputRange([String(range[0]), String(range[1])]);
		column?.setFilterValue(undefined);
	};

	const isFiltered = columnFilterValue !== undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 border-dashed bg-transparent"
				>
					<SlidersHorizontal className="mr-2 h-4 w-4" />
					{title}
					{isFiltered && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedRange[0]}
								{unit} - {selectedRange[1]}
								{unit}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								<Badge
									variant="secondary"
									className="rounded-sm px-1 font-normal"
								>
									{selectedRange[0]}
									{unit} - {selectedRange[1]}
									{unit}
								</Badge>
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							{title} ({range[0]}
							{unit} - {range[1]}
							{unit})
						</Label>
						<Slider
							value={selectedRange}
							onValueChange={handleSliderChange}
							min={range[0]}
							max={range[1]}
							step={1}
							className="w-full"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="min" className="text-xs">
								Min
							</Label>
							<Input
								id="min"
								className="h-8"
								value={inputRange[0]}
								onChange={(e) => handleInputChange(0, e.target.value)}
								onBlur={handleInputBlur}
								placeholder={String(range[0])}
							/>
						</div>
						<div className="grid flex-1 gap-2">
							<Label htmlFor="max" className="text-xs">
								Max
							</Label>
							<Input
								id="max"
								className="h-8"
								value={inputRange[1]}
								onChange={(e) => handleInputChange(1, e.target.value)}
								onBlur={handleInputBlur}
								placeholder={String(range[1])}
							/>
						</div>
					</div>
					{isFiltered && (
						<Button
							variant="ghost"
							onClick={handleReset}
							className="h-8 px-2 lg:px-3"
						>
							Reset
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
