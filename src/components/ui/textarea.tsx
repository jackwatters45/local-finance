import * as React from "react";
import RCTextarea from "rc-textarea";
import type { TextAreaProps, TextAreaRef } from "rc-textarea";
import { cn } from "@/lib/utils";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<TextAreaRef, TextAreaProps>(
	({ className, ...props }, ref) => {
		return (
			<RCTextarea
				className={cn(
					"flex min-h-[60px] w-full rounded-md resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				autoSize={true}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
