import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type ModalWithChildren = PropsWithChildren & { id: string; className?: string };

const ModalContainer = ({ id, children, ...props }: ModalWithChildren) => {
	return (
		<dialog id={id} className="text-2xl modal modal-bottom sm:modal-middle">
			{/* @ts-ignore */}
			<div className={cn("bg-[#fff8de] modal-box", props?.props?.className)}>
				<form method="dialog">
					<button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">
						✕
					</button>
				</form>
				{children}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button />
			</form>
		</dialog>
	);
};

export default ModalContainer;
