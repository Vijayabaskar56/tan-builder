import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { Column } from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface DataTableDateFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
}

export function DataTableDateFilter<TData, TValue>({
	column,
	title,
}: DataTableDateFilterProps<TData, TValue>) {
	const columnFilterValue = column?.getFilterValue() as
		| [number, number]
		| undefined;

	const [selectedRange, setSelectedRange] = React.useState<
		DateRange | undefined
	>(undefined);

	// Calculate date range from data
	const dateRange = React.useMemo(() => {
		const rows = (column as any)?.table?.getCoreRowModel().rows;
		if (!rows || rows.length === 0) return { min: undefined, max: undefined };

		const accessorKey = (column as any)?.columnDef?.accessorKey as string;
		const dateValues = rows
			.map((row: any) => {
				const val = row.original[accessorKey];
				if (val) {
					const date = new Date(val);
					return !isNaN(date.getTime()) ? date : undefined;
				}
				return undefined;
			})
			.filter((date): date is Date => date !== undefined);

		if (dateValues.length === 0) return { min: undefined, max: undefined };

		const min = new Date(Math.min(...dateValues.map((d: Date) => d.getTime())));
		const max = new Date(Math.max(...dateValues.map((d: Date) => d.getTime())));
		return { min, max };
	}, [(column as any)?.table?.getCoreRowModel().rows.length]);

	React.useEffect(() => {
		if (columnFilterValue) {
			setSelectedRange({
				from: new Date(columnFilterValue[0]),
				to: new Date(columnFilterValue[1]),
			});
		} else {
			setSelectedRange(undefined);
		}
	}, [columnFilterValue]);

	const handleSelect = (range: DateRange | undefined) => {
		setSelectedRange(range);
		if (range?.from && range?.to) {
			column?.setFilterValue([range.from.getTime(), range.to.getTime()]);
		} else {
			column?.setFilterValue(undefined);
		}
	};

	const handleReset = () => {
		setSelectedRange(undefined);
		column?.setFilterValue(undefined);
	};

	const isFiltered = columnFilterValue !== undefined;

	const disabledDates = (date: any) => {
		if (!dateRange.min || !dateRange.max) return false;
		return date < dateRange.min || date > dateRange.max;
	};

	const formatDateRange = (range: DateRange | undefined) => {
		if (!range?.from && !range?.to) return "";
		if (range.from && range.to) {
			return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
		}
		const validDate = range.from || range.to;
		return validDate ? format(validDate, "PPP") : "";
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 border-dashed bg-transparent"
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{title}
					{isFiltered && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedRange ? formatDateRange(selectedRange) : ""}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								<Badge
									variant="secondary"
									className="rounded-sm px-1 font-normal"
								>
									{selectedRange ? formatDateRange(selectedRange) : ""}
								</Badge>
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="p-3">
					<div className="space-y-2">
						<div className="text-sm font-medium">
							{title} (
							{dateRange.min && dateRange.max
								? `${format(dateRange.min, "PPP")} - ${format(dateRange.max, "PPP")}`
								: "No data"}
							)
						</div>
						<Calendar
							mode="range"
							selected={selectedRange}
							onSelect={handleSelect}
							disabled={disabledDates}
							numberOfMonths={2}
						/>
					</div>
					{isFiltered && (
						<div className="flex justify-end pt-2">
							<Button
								variant="ghost"
								onClick={handleReset}
								className="h-8 px-2 lg:px-3"
							>
								Reset
							</Button>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
