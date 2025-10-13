import { useEffect, useState } from "react";
import { TableBuilderService } from "@/services/table-builder.service";
import { useAppForm } from "@/components/ui/tanstack-form";
import { revalidateLogic } from "@/components/ui/tanstack-form";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { UploadIcon } from "lucide-react";
import { AnimatedIconButton } from "@/components/ui/animated-icon-button";
import FileUpload from "@/components/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as z from "zod";

// Utility functions for parsing data
const parseCSV = (csvText: string): any[] => {
	const lines = csvText.trim().split("\n");
	if (lines.length < 2)
		throw new Error("CSV must have at least headers and one data row");

	const headers = lines[0].split(",").map((h) => h.trim());
	const data = lines.slice(1).map((line) => {
		const values = line.split(",");
		const obj: any = {};
		headers.forEach((header, index) => {
			obj[header] = values[index]?.trim() || "";
		});
		return obj;
	});
	return data;
};

const parseJSON = (jsonText: string): any[] => {
	const parsed = JSON.parse(jsonText);
	if (Array.isArray(parsed)) {
		return parsed;
	} else if (typeof parsed === "object") {
		return [parsed];
	}
	return [];
};

const dataFormSchema = z.object({
	data: z.array(z.any()),
});

function DataUploadDialog() {
	const [open, setOpen] = useState(false);
	const [textareaText, setTextareaText] = useState("");

	const dataForm = useAppForm({
		defaultValues: {
			data: [],
		} as z.input<typeof dataFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: dataFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
	});

	const updateTableData = (data: any[]) => {
		TableBuilderService.importData(data);
	};

	const handleFileUpload = (files: any[]) => {
		const file = files[0]?.file;
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			if (text.trim() === "") {
				dataForm.setFieldValue("data", []);
				toast.error("The uploaded file is empty");
				return;
			}
			let data: any[] = [];
			try {
				if (file.type === "application/json" || file.name.endsWith(".json")) {
					data = parseJSON(text);
				} else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
					data = parseCSV(text);
				} else {
					throw new Error("Unsupported file type");
				}
				dataForm.setFieldValue("data", data);
				updateTableData(data);
				toast.success("Data uploaded successfully");
				setOpen(false);
			} catch (error) {
				toast.error(
					"Failed to parse file. Please ensure it's valid JSON or CSV.",
				);
			}
		};
		reader.readAsText(file);
	};

	const handleTextareaSubmit = () => {
		if (textareaText.trim() === "") {
			dataForm.setFieldValue("data", []);
			updateTableData([]);
			toast.success("Data cleared");
			setOpen(false);
			return;
		}
		try {
			let parsed;
			try {
				parsed = parseJSON(textareaText);
			} catch {
				parsed = parseCSV(textareaText);
			}
			dataForm.setFieldValue("data", parsed);
			updateTableData(parsed);
			toast.success("Data processed successfully");
			setOpen(false);
		} catch {
			toast.error("Invalid JSON or CSV format");
		}
	};

	useEffect(() => {
		setTextareaText(JSON.stringify(dataForm.state.values.data || [], null, 2));
	}, [dataForm.state.values.data]);

	return (
		<ResponsiveDialog open={open} onOpenChange={setOpen}>
			<ResponsiveDialogTrigger asChild>
				<AnimatedIconButton
					icon={<UploadIcon className="w-4 h-4 mr-1" />}
					text={<span className="hidden xl:block ml-1">Upload Data</span>}
					variant="ghost"
					size="sm"
				/>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent className="max-w-4xl max-h-[85vh] p-0">
				<div className="flex flex-col h-full max-h-[85vh]">
					<ResponsiveDialogHeader className="p-6 pb-4 border-b">
						<ResponsiveDialogTitle>Upload Table Data</ResponsiveDialogTitle>
						<ResponsiveDialogDescription>
							Upload a CSV or JSON file, or paste your data directly
						</ResponsiveDialogDescription>
					</ResponsiveDialogHeader>
					<div className="flex-1 px-6 py-4 space-y-6">
						{/* File Upload Section */}
						<div className="space-y-4">
							<div className="text-sm font-medium">Upload File</div>
							<FileUpload onFilesAdded={handleFileUpload} />
							<div className="text-center text-sm text-muted-foreground">
								or paste CSV/JSON data below
							</div>
						</div>

						{/* Textarea Section */}
						<div className="space-y-4">
							<div className="text-sm font-medium">Paste Data</div>
							<Textarea
								placeholder="Enter your CSV or JSON data here..."
								value={textareaText}
								onChange={(e) => setTextareaText(e.target.value)}
								className="min-h-[200px] font-mono text-sm"
							/>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setTextareaText("")}>
									Clear
								</Button>
								<Button onClick={handleTextareaSubmit}>Process Data</Button>
							</div>
						</div>
					</div>
				</div>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

export default DataUploadDialog;
