import SignInForm from "@/components/forms/sign-in";
import Icon from "@/components/icon";

const Page = () => {
	return (
		<div>
			<div className="flex justify-center">
				<div className="flex items-center gap-4">
					<Icon name="common/logo" className="text-[64px] text-[#46754B]" />
					<h1 className="text-[#46754B] text-[64px] font-extrabold">BiBOOK</h1>
				</div>
			</div>
			<SignInForm />
		</div>
	);
};

export default Page;
