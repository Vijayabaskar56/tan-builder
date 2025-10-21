import { AnimatePresence, motion } from "motion/react";
import {
	CodeBlock,
	CodeBlockCode,
	CodeBlockGroup,
} from "@/components/ui/code-block";
import CopyButton from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SettingsCollection } from "@/db-collections/settings.collections";
import useSettings from "@/hooks/use-settings";
import { formatCode, updatePreferredPackageManager } from "@/lib/utils";

export const Wrapper = ({
	children,
	language,
	title,
}: {
	language: string;
	children: string;
	title: string;
}) => {
	return (
		<CodeBlock className="my-0 w-full border-border border rounded-md overflow-hidden bg-background dark:bg-background/95">
			<CodeBlockGroup className="border-border border-b px-4 py-2 bg-muted/50 dark:bg-muted/20">
				<div className="bg-muted dark:bg-muted/80 py-1 px-1.5 rounded-sm text-muted-foreground dark:text-muted-foreground/90 text-sm font-medium">
					{title}
				</div>
				<CopyButton text={children} />
			</CodeBlockGroup>
			<div className="*:mt-0 [&_pre]:p-3 w-full bg-background dark:bg-background/95">
				<CodeBlockCode code={children} language={language} />
			</div>
		</CodeBlock>
	);
};

const TableCodeBlockPackagesInstallation = () => {
	const settings = useSettings();
	const preferredPackageManager = settings?.preferredPackageManager || "pnpm";

	const tabsData = [
		{
			value: "pnpm",
			base: `pnpm add @tanstack/react-table`,
			shadcn: `pnpm dlx shadcn@latest add data-grid data-grid-pagination data-grid-table scroll-area`,
		},
		{
			value: "npm",
			base: `npm i @tanstack/react-table`,
			shadcn: `npx shadcn@latest add data-grid data-grid-pagination data-grid-table scroll-area`,
		},
		{
			value: "yarn",
			base: `yarn add @tanstack/react-table`,
			shadcn: `npx shadcn@latest add data-grid data-grid-pagination data-grid-table scroll-area`,
		},
		{
			value: "bun",
			base: `bun add @tanstack/react-table`,
			shadcn: `bunx --bun shadcn@latest add data-grid data-grid-pagination data-grid-table scroll-area`,
		},
	];

	return (
		<div className="w-full py-5 max-w-full">
			<h2 className="font-semibold text-start">Install base packages</h2>
			<Tabs
				value={settings?.preferredPackageManager}
				onValueChange={(value) =>
					updatePreferredPackageManager(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="w-full mt-2 rounded-md"
			>
				<TabsList>
					{tabsData.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.value}
						</TabsTrigger>
					))}
				</TabsList>
				{tabsData.map((item) => (
					<TabsContent key={item.value} value={item.value}>
						<CodeBlock>
							<CodeBlockCode code={item.base} language="bash" />
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
			<h2 className="font-semibold text-start mt-4">
				Install required shadcn components
			</h2>
			<Tabs
				value={preferredPackageManager}
				onValueChange={(value) =>
					updatePreferredPackageManager(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="w-full mt-2 rounded-md"
			>
				<TabsList>
					{tabsData.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.value}
						</TabsTrigger>
					))}
				</TabsList>
				{tabsData.map((item) => (
					<TabsContent key={item.value} value={item.value}>
						<CodeBlock>
							<CodeBlockCode code={item.shadcn} language="bash" />
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

const TableCodeBlockTSX = ({ code }: { code: string }) => {
	const formattedCode = formatCode(code);
	return (
		<div className="relative max-w-full">
			<Wrapper title="table.tsx" language="tsx">
				{formattedCode}
			</Wrapper>
		</div>
	);
};

export function GeneratedTableCodeViewer({
	isGenerateSuccess,
	generatedId,
	tabsData,
	code,
}: {
	isGenerateSuccess: boolean;
	generatedId: string;
	tabsData: { value: string; registery: string }[];
	code: string;
}) {
	const settings = useSettings();
	return (
		<Tabs defaultValue="tsx" className="w-full min-w-full flex">
			<div className="flex justify-between">
				<TabsList>
					<TabsTrigger value="tsx">TSX</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="tsx" tabIndex={-1}>
				<AnimatePresence>
					{isGenerateSuccess && generatedId && (
						<motion.div
							initial={{ opacity: 0, height: 0, y: -20 }}
							animate={{ opacity: 1, height: "auto", y: 0 }}
							exit={{ opacity: 0, height: 0, y: -20 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className="border-t mt-4"
						>
							<ScrollArea className="max-h-[40vh]">
								<h2 className="font-semibold text-start pt-4">
									Install With Shadcn CLI Command
								</h2>
								<Tabs
									value={settings?.preferredPackageManager}
									onValueChange={(value) =>
										updatePreferredPackageManager(
											value as SettingsCollection["preferredPackageManager"],
										)
									}
									className="w-full mt-2 rounded-md"
								>
									<TabsList>
										{tabsData.map((item) => (
											<TabsTrigger key={item.value} value={item.value}>
												{item.value}
											</TabsTrigger>
										))}
									</TabsList>
									{tabsData.map((item) => (
										<TabsContent key={item.value} value={item.value}>
											<CodeBlock>
												<CodeBlockCode code={item.registery} language="bash" />
											</CodeBlock>
										</TabsContent>
									))}
								</Tabs>
							</ScrollArea>
						</motion.div>
					)}
				</AnimatePresence>
				<TableCodeBlockPackagesInstallation />
				<div className="border-t border-dashed w-full mt-6" />
				<TableCodeBlockTSX code={code} />
			</TabsContent>
		</Tabs>
	);
}
