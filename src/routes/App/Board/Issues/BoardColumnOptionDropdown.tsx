import { useState } from "react";
import DropdownPanel from "../../../../components/DropdownPanel";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";

export interface BoardColumnOptionDropdownProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onDeleteColumn: () => void;
}

const BoardColumnOptionDropdown = ({
  anchor,
  onCloseDropdown,
  onDeleteColumn,
}: BoardColumnOptionDropdownProps) => {
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement>();

  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={false}
      onClickGoBack={() => {}}
      onCloseDropdown={onCloseDropdown}
      title="Options"
      className="h-max max-h-80"
    >
      <button
        onClick={(e) => setButtonElement(e.currentTarget)}
        className="w-full text-left px-4 py-2 hover:bg-gray-200 active:bg-gray-300 rounded-sm"
      >
        Delete list
      </button>
      {buttonElement && (
        <DropdownRemoveAssertion
          anchor={buttonElement}
          onClickDeleteConfirm={onDeleteColumn}
          onCloseDropdown={() => setButtonElement(undefined)}
        />
      )}
    </DropdownPanel>
  );
};

export default BoardColumnOptionDropdown;
