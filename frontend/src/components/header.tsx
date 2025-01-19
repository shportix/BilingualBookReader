"use client";

import { PropsWithChildren, useState } from "react";
import Icon from "./icon";
import useProfile from "@/components/hooks/useProfile";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = ({ children }: PropsWithChildren) => {
	const { data: profile } = useProfile();

	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const router = useRouter();

	return (
		<div className="flex-1 bg-[#EEE7CF]">
			<div className="flex justify-end p-2 border-b-2 border-[#B7B094] border-opacity-50">
				<div className="flex items-center gap-6">
					{isSearchOpen && (
						<input
							type="text"
							onChange={(e) => {
								router.replace(`?search=${e.target.value}`, { scroll: false });
							}}
							className="input input-primary"
							placeholder="Пошук..."
						/>
					)}
					<button
						className="btn btn-ghost btn-lg btn-circle"
						onClick={() => setIsSearchOpen(!isSearchOpen)}
					>
						<Icon className="text-[40px] text-[#46754B]" name="common/search" />
					</button>
					<button
						className="btn btn-ghost btn-lg btn-circle"
						onClick={() => router.push("/profile")}
					>
						{profile?.avatar ? (
							<Image
								src={`data:image/png;base64,${profile.avatar}`}
								width={44}
								height={44}
								className="rounded-full"
								alt="avatar"
							/>
						) : (
							<Icon
								className="text-[40px] text-[#46754B]"
								name="common/profile"
							/>
						)}
					</button>
					{profile && (
						<div className="text-2xl text-secondary-content">
							Привіт, {profile.first_name || profile.username}!
						</div>
					)}
				</div>
			</div>
			<div className="px-6 pt-6 text-2xl text-secondary-content">
				{children}
			</div>
		</div>
	);
};

export default Header;
