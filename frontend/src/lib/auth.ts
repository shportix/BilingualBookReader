import { SignInSchema } from "@/components/forms/sign-in";
import { SignUpSchema } from "@/components/forms/sign-up";

const signIn = async (data: SignInSchema) => {
	const res = await fetch("http://localhost:8000/user/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: data.loginOrPhone,
			password: data.password,
		}),
	});
	if (res.status === 400 || res.status === 404) {
		const resData = await res.json();
		if (resData?.errors?.[0]) {
			throw new Error(resData.errors[0]);
		}
		throw new Error(resData.errors[0]);
	}
	const resData = await res.json();
	return resData;
};

const signUp = async (data: SignUpSchema) => {
	const res = await fetch("http://localhost:8000/user/create/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: data.login,
			password: data.password,
			email: data.email,
			first_name: data.firstName,
			last_name: data.lastName,
			phone: data.phoneNumber,
		}),
	});
	if (res.status === 400) {
		const resData = await res.json();
		if (resData?.errors?.username?.[0]) {
			throw new Error(resData?.errors?.username?.[0]);
		}
		throw new Error(resData.errors[0]);
	}
	const resData = await res.json();
	return resData;
};

export { signIn, signUp };
