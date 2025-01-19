"use client";
import EditProfileForm from "@/components/forms/edit-profile";
import { useEffect } from "react";

const Page = () => {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem("token") === null) {
			window.location.href = "/auth/sign-in";
		}
	}, []);

	return (
		<div className="bg-[#FFF8DE] rounded-3xl border border-[#B7B094] p-4">
			<EditProfileForm />
		</div>
	);
};

export default Page;
