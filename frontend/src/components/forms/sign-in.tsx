"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schemaSignIn = z.object({
	loginOrPhone: z.string().min(1, "Логін або телефон повинен бути заповнений"),
	password: z.string().min(8, "Пароль повинен містити мінімум 8 символів"),
});

export type SignInSchema = z.infer<typeof schemaSignIn>;

const SignInForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignInSchema>({
		resolver: zodResolver(schemaSignIn),
	});

	const router = useRouter();

	const onSubmit = async (data: SignInSchema) => {
		try {
			const { token } = await signIn(data);
			localStorage.setItem("token", token);
			router.push("/");
		} catch (err) {
			setError("root", {
				// @ts-ignore
				message: err.message,
			});
			//
		} finally {
			//
		}
	};

	return (
		<form className="gap-2 form-control" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.loginOrPhone &&
							"input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Логін або телефон"
						{...register("loginOrPhone")}
					/>
				</label>
				<label className="label">
					{errors.loginOrPhone && (
						<span className="label-text-alt text-error">
							{errors.loginOrPhone.message}
						</span>
					)}
				</label>
			</div>
			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.password && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="password"
						placeholder="Пароль"
						className="grow"
						{...register("password")}
					/>
				</label>
				<label className="label">
					{errors.password && (
						<span className="label-text-alt text-error">
							{errors.password.message}
						</span>
					)}
				</label>
			</div>
			<button
				disabled={isSubmitting}
				className={cn("btn btn-primary", errors.root && "btn-error")}
			>
				Вхід
			</button>
			{errors.root && (
				<span className="label-text-alt text-error">{errors.root.message}</span>
			)}
			<Link href="/auth/sign-up">
				<button type="button" className="w-full btn btn-secondary">
					Регістрація
				</button>
			</Link>
		</form>
	);
};

export default SignInForm;
