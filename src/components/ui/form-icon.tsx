import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/utils/utils";

export interface FormIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface FormIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const variants: Variants = {
	normal: { opacity: 0 },
	animate: { opacity: 1 },
};

const FormIcon = forwardRef<FormIconHandle, FormIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, onMouseEnter],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave],
		);

		return (
			<div
				className={cn(className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				role="button"
				tabIndex={0}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Form Icon</title>
					<rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
					<motion.g
						variants={variants}
						animate={controls}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 14,
							delay: 0,
						}}
					>
						<path d="M7 10v4" />
						<path d="M5 13l4 -2" />
						<path d="M5 11l4 2" />
					</motion.g>
					<motion.g
						variants={variants}
						animate={controls}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 14,
							delay: 0.1,
						}}
					>
						<path d="M13 10v4" />
						<path d="M11 13l4 -2" />
						<path d="M11 11l4 2" />
					</motion.g>
				</svg>
			</div>
		);
	},
);

FormIcon.displayName = "FormIcon";

export { FormIcon };
