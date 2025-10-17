import { useCallback, useEffect, useRef } from "react";
import type {
	WorkerRequest,
	WorkerResponse,
} from "@/workers/data-processor.worker";

interface ParseDataOptions {
	content: string;
	fileType: "csv" | "json" | "auto";
	onSuccess: (data: any[]) => void;
	onError: (error: string) => void;
}

export function useDataProcessorWorker() {
	const workerRef = useRef<Worker | null>(null);

	// Initialize worker on mount
	useEffect(() => {
		// Create worker from the worker file
		workerRef.current = new Worker(
			new URL("../workers/data-processor.worker.ts", import.meta.url),
			{ type: "module" },
		);

		return () => {
			// Cleanup worker on unmount
			workerRef.current?.terminate();
		};
	}, []);

	// Parse data using the worker
	const parseData = useCallback(
		({ content, fileType, onSuccess, onError }: ParseDataOptions) => {
			if (!workerRef.current) {
				onError("Worker not initialized");
				return;
			}

			// Set up one-time message handler
			const handleMessage = (event: MessageEvent<WorkerResponse>) => {
				const { type, data, error } = event.data;

				if (type === "success" && data) {
					onSuccess(data);
				} else if (type === "error" && error) {
					onError(error);
				}

				// Remove listener after handling
				workerRef.current?.removeEventListener("message", handleMessage);
			};

			// Add message listener
			workerRef.current.addEventListener("message", handleMessage);

			// Send parse request to worker
			const request: WorkerRequest = {
				type: "parse",
				data: { content, fileType },
			};
			workerRef.current.postMessage(request);
		},
		[],
	);

	return { parseData };
}
