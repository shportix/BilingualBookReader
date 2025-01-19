import ModalContainer from "@/components/modal/container";

// New import
import ReadBook from "@/components/modal/content/read-book";
import AddBook from "@/components/modal/content/add-book";
import DeleteUser from "@/components/modal/content/delete-user";
import DeleteAllWords from "@/components/modal/content/delete-all-words";

const modals = [
	// New modal
	{
		id: "read-book",
		Modal: ReadBook,
		props: { className: "!max-w-[1800px] overflow-hidden" },
	},
	{ id: "add-book", Modal: AddBook },
	{ id: "delete-user", Modal: DeleteUser },
	{ id: "delete-all-words", Modal: DeleteAllWords },
];

const ModalBuilder = () => {
	return modals.map(({ Modal, ...props }) => {
		return (
			<ModalContainer key={props.id} {...props}>
				<Modal key={props.id} {...props} />
			</ModalContainer>
		);
	});
};

export default ModalBuilder;
