import { CodeIcon } from "lucide-react";
import { TableBuilderService } from "@/services/table-builder.service";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnimatedIconButton } from "./ui/animated-icon-button";
import { RotateCWIcon } from "./ui/rotate-cw";
import { ShareIcon } from "./ui/share";
import DataUploadDialog from "./table-components/table-data-upload-dialog";

export default function TableHeader() {
	const resetTable = () => {
		TableBuilderService.resetTable();
	};

	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-auto lg:h-14 border-b items-center mx-3 flex-col lg:flex-row justify-end">
				{/* Actions section */}
				<ScrollArea className="md:w-fit w-full py-2 order-1 lg:order-2">
					<div className="flex items-center gap-2">
						<DataUploadDialog />
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<RotateCWIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Reset Table</span>}
							variant="ghost"
							onClick={resetTable}
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<ShareIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Share</span>}
							variant="ghost"
							disabled
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<CodeIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Code</span>}
							variant="ghost"
							disabled
						/>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</header>
	);
}
