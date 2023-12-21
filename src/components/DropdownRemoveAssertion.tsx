import Button from "./Button";
import DropdownPanel from "./DropdownPanel";

export interface DropdownRemoveAssertionProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onClickDeleteConfirm: () => void;
}

const DropdownRemoveAssertion = ({
  anchor,
  onCloseDropdown,
  onClickDeleteConfirm,
}: DropdownRemoveAssertionProps) => {
  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={false}
      onClickGoBack={() => {}}
      onCloseDropdown={onCloseDropdown}
      title="Confirm Deletion"
      className="h-auto max-h-max px-2"
    >
      <h3>This action cannot be undone. Proceed?</h3>
      <Button
        $variant="danger"
        className="w-full mt-6"
        onClick={onClickDeleteConfirm}
      >
        Remove
      </Button>
    </DropdownPanel>
  );
};

export default DropdownRemoveAssertion;
