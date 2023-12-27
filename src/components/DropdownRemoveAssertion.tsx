import Button from "./Button";
import DropdownPanel, {
  HorizontalPosition,
  VerticalPosition,
} from "./DropdownPanel";

export interface DropdownRemoveAssertionProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onClickDeleteConfirm: () => void;
  x?: HorizontalPosition;
  y?: VerticalPosition;
}

const DropdownRemoveAssertion = ({
  anchor,
  onCloseDropdown,
  onClickDeleteConfirm,
  x,
  y,
}: DropdownRemoveAssertionProps) => {
  return (
    <DropdownPanel
      x={x}
      y={y}
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
