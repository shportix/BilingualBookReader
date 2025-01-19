"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schemaSignUp = z
	.object({
		firstName: z.string().min(1, "Ім'я повинно бути заповнене"),
		lastName: z.string().min(1, "Прізвище повинно бути заповнене"),
		login: z.string().min(1, "Логін повинен бути заповнений"),
		email: z
			.string()
			.min(1, "Електронна пошта повинна бути заповнена")
			.email("Невірний формат електронної пошти"),
		phoneNumber: z
			.string()
			.min(10, "Номер телефону повинен містити мінімум 10 символів")
			.regex(
				new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
				"Невірний формат номеру телефону",
			),
		password: z.string().min(8, "Пароль повинен містити мінімум 8 символів"),
		confirmPassword: z
			.string()
			.min(8, "Підтвердження паролю повинно містити мінімум 8 символів"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Паролі не співпадають",
		path: ["confirmPassword"],
	});

export type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignUpSchema>({
		resolver: zodResolver(schemaSignUp),
	});

	const router = useRouter();

	const onSubmit = async (data: SignUpSchema) => {
		try {
			const { token, _user } = await signUp(data);
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
						errors.firstName && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Ім'я"
						{...register("firstName")}
					/>
				</label>
				<label className="label">
					{errors.firstName && (
						<span className="label-text-alt text-error">
							{errors.firstName.message}
						</span>
					)}
				</label>
			</div>

			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.lastName && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Прізвище"
						{...register("lastName")}
					/>
				</label>
				<label className="label">
					{errors.lastName && (
						<span className="label-text-alt text-error">
							{errors.lastName.message}
						</span>
					)}
				</label>
			</div>

			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.login && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Логін"
						{...register("login")}
					/>
				</label>
				<label className="label">
					{errors.login && (
						<span className="label-text-alt text-error">
							{errors.login.message}
						</span>
					)}
				</label>
			</div>

			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.email && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Електронна пошта"
						{...register("email")}
					/>
				</label>
				<label className="label">
					{errors.email && (
						<span className="label-text-alt text-error">
							{errors.email.message}
						</span>
					)}
				</label>
			</div>

			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.phoneNumber &&
							"input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						placeholder="Номер телефону"
						{...register("phoneNumber")}
					/>
				</label>
				<label className="label">
					{errors.phoneNumber && (
						<span className="label-text-alt text-error">
							{errors.phoneNumber.message}
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
						className="grow"
						placeholder="Пароль"
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

			<div>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.confirmPassword &&
							"input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<input
						disabled={isSubmitting}
						type="password"
						className="grow"
						placeholder="Підтвердження паролю"
						{...register("confirmPassword")}
					/>
				</label>
				<label className="label">
					{errors.confirmPassword && (
						<span className="label-text-alt text-error">
							{errors.confirmPassword.message}
						</span>
					)}
				</label>
			</div>
			<button
				disabled={isSubmitting}
				className={cn("btn btn-primary", errors.root && "btn-error")}
			>
				Зареєструватись
			</button>
			{errors.root && (
				<span className="text-sm text-error">{errors.root.message}</span>
			)}
			<Link href="/auth/sign-in">
				<button disabled={isSubmitting} className="w-full btn btn-secondary">
					Ввійти
				</button>
			</Link>
		</form>
	);
};

export default SignUpForm;
