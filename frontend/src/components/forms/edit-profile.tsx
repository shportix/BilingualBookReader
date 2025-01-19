"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Icon from "../icon";
import useProfile from "@/components/hooks/useProfile";
import { useEffect } from "react";
import { changePassword, editProfile } from "@/lib/api";

const schemaEditProfile = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	login: z.string().optional(),
	avatar: z
		.any()
		.optional()
		.refine((file) => {
			return typeof file !== "string" ? file?.size <= 5e6 : true;
		}, `Max image size is 5MB.`)
		.refine(
			(file) =>
				typeof file !== "string"
					? ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
							file?.type,
						)
					: true,
			"Only .jpg, .jpeg, .png and .webp formats are supported.",
		)
		.optional(),
	email: z.string().optional(),
	phoneNumber: z.string().optional(),
});

const schemaUpdatePassword = z.object({
	oldPassword: z.string().min(8, "Пароль повинен містити мінімум 8 символів"),
	newPassword: z
		.string()
		.min(8, "Підтвердження паролю повинно містити мінімум 8 символів"),
});

type EditProfileSchema = z.infer<typeof schemaEditProfile>;
type UpdatePasswordSchema = z.infer<typeof schemaUpdatePassword>;

const EditProfileForm = () => {
	const { data: profile, isSuccess } = useProfile();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		getValues,
		setError,
	} = useForm<EditProfileSchema>({
		resolver: zodResolver(schemaEditProfile),
	});

	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		setError: setErrorPassword,
		formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
	} = useForm<UpdatePasswordSchema>({
		resolver: zodResolver(schemaUpdatePassword),
	});

	useEffect(() => {
		if (isSuccess) {
			reset({
				avatar: profile?.avatar || "",
				email: profile?.email || "",
				firstName: profile?.first_name || "",
				lastName: profile?.last_name || "",
				login: profile?.username || "",
				phoneNumber: profile?.phone || "",
			});
		}
	}, [isSuccess]);

	const onSubmit = async (data: EditProfileSchema) => {
		try {
			const formData: any = {};
			if (data.avatar && data.avatar.includes("base64,")) {
				formData["avatar"] = data.avatar;
			}
			if (data.firstName) {
				formData["first_name"] = data.firstName;
			}
			if (data.lastName) {
				formData["last_name"] = data.lastName;
			}
			if (data.login) {
				formData["username"] = data.login;
			}
			if (data.email) {
				formData["email"] = data.email;
			}
			if (data.phoneNumber) {
				formData["phone"] = data.phoneNumber;
			}

			await editProfile(formData);
			//
		} catch (err) {
			// @ts-ignore
			setError("root", { message: err.message });
			//
		} finally {
			//
		}
	};

	const onSubmitPassword = async (data: UpdatePasswordSchema) => {
		try {
			await changePassword(data.oldPassword, data.newPassword);
		} catch (err) {
			// @ts-ignore
			setErrorPassword("root", { message: err.message });
			//
		} finally {
			//
		}
	};

	const handleChange = () => {
		const file = (document.getElementById("avatar") as HTMLInputElement)
			?.files?.[0];
		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				const base64String = e.target?.result;
				reset({ ...getValues(), avatar: base64String });
			};

			reader.readAsDataURL(file);
		}
	};

	const avatar = getValues("avatar");
	let avatarSrc = "";
	if (avatar) {
		avatarSrc = avatar.includes("base64,")
			? avatar
			: `data:image/png;base64,${avatar}`;
	} else {
		avatarSrc = "/anon.png";
	}

	return (
		<div className="flex flex-col gap-8">
			<form
				className="gap-2 form-control max-w-[550px] mx-auto w-full"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative mx-auto bg-gray-800 rounded-full w-52 h-52">
					<Image
						className="rounded-[inherit]"
						width={208}
						height={208}
						src={avatarSrc}
						alt="avatar"
					/>
					<div className="absolute flex items-end rounded-[inherit] inset-0 overflow-hidden">
						<label
							htmlFor="avatar"
							className="bg-[#B7B094] cursor-pointer flex justify-center items-center bg-opacity-75 flex-1 h-[50px]"
						>
							<Icon
								className="text-4xl text-secondary-content"
								name="common/add-photo"
							/>
							<input type="file" hidden id="avatar" onChange={handleChange} />
						</label>
					</div>
				</div>
				<div className="flex gap-4 ">
					<div className="flex-1">
						<div>
							<label className="label">
								<span className="label-text">Імʼя</span>
							</label>
							<label
								className={cn(
									"flex items-center gap-2 input input-bordered",
									errors.firstName &&
										"input-error bg-error bg-opacity-10 text-error",
									isSubmitting && "input-disabled",
								)}
							>
								<input
									disabled={isSubmitting}
									type="text"
									className="grow"
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
							<label className="label">
								<span className="label-text">Прізвище</span>
							</label>
							<label
								className={cn(
									"flex items-center gap-2 input input-bordered",
									errors.lastName &&
										"input-error bg-error bg-opacity-10 text-error",
									isSubmitting && "input-disabled",
								)}
							>
								<input
									disabled={isSubmitting}
									type="text"
									className="grow"
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
							<label className="label">
								<span className="label-text">Логін</span>
							</label>
							<label
								className={cn(
									"flex items-center gap-2 input input-bordered",
									errors.login &&
										"input-error bg-error bg-opacity-10 text-error",
									isSubmitting && "input-disabled",
								)}
							>
								<input
									disabled={isSubmitting}
									type="text"
									className="grow"
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
							<label className="label">
								<span className="label-text">Електронна пошта</span>
							</label>
							<label
								className={cn(
									"flex items-center gap-2 input input-bordered",
									errors.email &&
										"input-error bg-error bg-opacity-10 text-error",
									isSubmitting && "input-disabled",
								)}
							>
								<input
									disabled={isSubmitting}
									type="text"
									className="grow"
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
					</div>
					<div className="flex-1">
						<div>
							<label className="label">
								<span className="label-text">Номер телефону</span>
							</label>
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
					</div>
				</div>
				{errors.root && (
					<span className="text-sm text-error">{errors.root.message}</span>
				)}
				<div className="flex gap-4">
					<button
						disabled={isSubmitting}
						className={cn("btn flex-1 btn-primary", errors.root && "btn-error")}
					>
						Зберегти
					</button>
					<button
						type="button"
						onClick={() => {
							(
								document.getElementById("delete-user") as HTMLDialogElement
							)?.showModal();
						}}
						className="flex-1 btn btn-error"
					>
						Видалити акаунт
					</button>
				</div>
			</form>
			<form
				className="gap-2 form-control max-w-[550px] mx-auto w-full"
				onSubmit={handleSubmitPassword(onSubmitPassword)}
			>
				<div>
					<label className="label">
						<span className="label-text">Введіть старий пароль</span>
					</label>
					<label
						className={cn(
							"flex items-center gap-2 input input-bordered",
							errorsPassword.oldPassword &&
								"input-error bg-error bg-opacity-10 text-error",
							isSubmittingPassword && "input-disabled",
						)}
					>
						<input
							disabled={isSubmittingPassword}
							type="password"
							className="grow"
							{...registerPassword("oldPassword")}
						/>
					</label>
					<label className="label">
						{errorsPassword.oldPassword && (
							<span className="label-text-alt text-error">
								{errorsPassword.oldPassword.message}
							</span>
						)}
					</label>
				</div>

				<div>
					<label className="label">
						<span className="label-text">Введіть новий пароль</span>
					</label>
					<label
						className={cn(
							"flex items-center gap-2 input input-bordered",
							errorsPassword.newPassword &&
								"input-error bg-error bg-opacity-10 text-error",
							isSubmittingPassword && "input-disabled",
						)}
					>
						<input
							disabled={isSubmittingPassword}
							type="password"
							className="grow"
							{...registerPassword("newPassword")}
						/>
					</label>
					<label className="label">
						{errorsPassword.newPassword && (
							<span className="label-text-alt text-error">
								{errorsPassword.newPassword.message}
							</span>
						)}
					</label>
				</div>
				{errorsPassword.root && (
					<span className="text-sm text-error">
						{errorsPassword.root.message}
					</span>
				)}
				<div className="flex flex-col">
					<button
						disabled={isSubmittingPassword}
						className={cn(
							"btn w-full btn-primary",
							errorsPassword.root && "btn-error",
						)}
					>
						Змінити пароль
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditProfileForm;
