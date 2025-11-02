// app-toggle.tsx
import { useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { FormIcon } from "@/components/ui/form-icon";
import { TableIcon } from "@/components/ui/table-icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppToggle() {
	const id = useId();
	const navigate = useNavigate();
	const location = useLocation();

	const isFormBuilder = location.pathname.startsWith("/form-builder");
	const isTableBuilder = location.pathname.startsWith("/table-builder");

	if (!isFormBuilder && !isTableBuilder) {
		return null;
	}

	const [isLabelHidden, setIsLabelHidden] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 1279px)");
		const onChange = () => setIsLabelHidden(mql.matches);
		mql.addEventListener("change", onChange);
		setIsLabelHidden(mql.matches);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	const selectedValue = isFormBuilder ? "off" : isTableBuilder ? "on" : "none";

	const handleValueChange = (value: string) => {
		const newPath = value === "off" ? "/form-builder" : "/table-builder";
		navigate({
			to: newPath,
			replace: true,
		});
	};

	const formLabel = (
		<label
			htmlFor={`${id}-1`}
			className="group-data-[state=on]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none"
		>
			<FormIcon className="mr-2 opacity-60" size={16} />
			<span className="hidden xl:block">Form Builder</span>
			<RadioGroupItem id={`${id}-1`} value="off" className="sr-only" />
		</label>
	);

	const tableLabel = (
		<label
			htmlFor={`${id}-2`}
			className="group-data-[state=off]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none"
		>
			<TableIcon className="mr-2 opacity-60" size={16} />
			<span className="hidden xl:block">Table Builder</span>
			<span className="absolute text-primary -top-2 -right-3">Beta</span>
			<RadioGroupItem id={`${id}-2`} value="on" className="sr-only" />
		</label>
	);

	return (
		<TooltipProvider>
			<div className="bg-input/50 inline-flex h-8 rounded-md p-0.5">
				<RadioGroup
					value={selectedValue}
					onValueChange={handleValueChange}
					className="group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:shadow-xs after:transition-[translate,box-shadow] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full data-[state=none]:after:opacity-0"
					data-state={selectedValue}
				>
					{isLabelHidden ? (
						<Tooltip>
							<TooltipTrigger asChild>{formLabel}</TooltipTrigger>
							<TooltipContent>
								<p>Form Builder</p>
							</TooltipContent>
						</Tooltip>
					) : (
						formLabel
					)}
					{isLabelHidden ? (
						<Tooltip>
							<TooltipTrigger asChild>{tableLabel}</TooltipTrigger>
							<TooltipContent>
								<p>Table Builder</p>
							</TooltipContent>
						</Tooltip>
					) : (
						tableLabel
					)}
				</RadioGroup>
			</div>
		</TooltipProvider>
	);
}
