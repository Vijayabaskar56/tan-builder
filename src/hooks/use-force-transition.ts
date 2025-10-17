import { useRef, useTransition } from "react";
export function useForcedTransition() {
	const [isPending, startTransition] = useTransition();

	const blockRef = useRef<ReturnType<
		typeof Promise.withResolvers<void>
	> | null>(null);

	function start() {
		blockRef.current = Promise.withResolvers<void>();
		startTransition(async () => {
			await blockRef.current?.promise;
		});
	}

	function stop() {
		blockRef.current?.resolve();
	}

	return { isPending, start, stop };
}
