import { CheckIcon, TerminalIcon } from "lucide-react";

import { useCopy } from "@/hooks/use-copy";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { Button } from "./ui/button";

const CopyLayout = ({ command }: { command: string | undefined }) => {
	const { copied, copy } = useCopy();

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="inline-flex items-center gap-1 text-sm hover:underline max-sm:hidden"
						onClick={() => copy(command || "")}
						aria-label={copied ? "Copied" : "Copy command"}
						disabled={copied}
					>
						{copied ? (
							<CheckIcon className="size-4 text-emerald-600" />
						) : (
							<TerminalIcon className="text-muted-foreground size-4" />
						)}
						CLI Command
					</Button>
				</TooltipTrigger>
				<TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
					Click to copy
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyLayout;
