"use client";

import { useQuery } from "@tanstack/react-query";

const useProfile = () => {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const res = await fetch("http://localhost:8000/user/info/", {
				headers: {
					Authorization: `Token ${localStorage.getItem("token")}`,
				},
			});
			const data = await res.json();
			return data.user;
		},
	});
};

export default useProfile;
