"use client";

import { deleteUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const DeleteUser = () => {
	const modal = useRef<HTMLDivElement>(null);

	const router = useRouter();

	const closeDialog = () => modal.current?.closest("dialog")?.close();

	const deleteUserSubmit = async () => {
		await deleteUser();
		localStorage.removeItem("token");
		closeDialog();
		router.push("/auth/sign-in");
	};

	return (
		<div ref={modal} className="py-4">
			<h3 className="text-xl">
				Ви дійсно хочете <span className="text-red-400">видалити</span> акаунт?
			</h3>
			<div className="flex gap-4 mt-4">
				<button onClick={closeDialog} className="flex-1 btn btn-lg btn-primary">
					Ні, залишити
				</button>
				<button
					onClick={deleteUserSubmit}
					className="flex-1 btn btn-lg btn-error"
				>
					Так, видалити
				</button>
			</div>
		</div>
	);
};

export default DeleteUser;
