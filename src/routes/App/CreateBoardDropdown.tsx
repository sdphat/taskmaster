import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import DropdownPanel from "../../components/DropdownPanel";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormLabel from "../../components/FormLabel";

export interface CreateBoardData {
  title: string;
}

export interface CreateBoardDropdownProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onCreateBoard: (data: CreateBoardData) => void;
}

const CreateBoardDropdown = ({
  anchor,
  onCloseDropdown,
  onCreateBoard,
}: CreateBoardDropdownProps) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    onCreateBoard(data as CreateBoardData);
  });

  return (
    <DropdownPanel
      className="h-max"
      anchor={anchor}
      canGoBack={false}
      onClickGoBack={() => {}}
      onCloseDropdown={onCloseDropdown}
      title="Create board"
    >
      <form onSubmit={onSubmit} className="px-4">
        <FormField>
          <FormLabel>Board title</FormLabel>
          <FormInput {...register("title", { required: true })} />
        </FormField>
        <Button $variant="primary" className="w-full mt-2">
          Create
        </Button>
      </form>
    </DropdownPanel>
  );
};

export default CreateBoardDropdown;
