import { ReactNode, useState } from "react";
import BackIcon from "remixicon-react/ArrowLeftLineIcon";
import CloseIcon from "remixicon-react/CloseLineIcon";
import tw from "tailwind-styled-components";
import useClickOutside from "../hooks/useClickOutside";
import Button from "./Button";

const DROPDOWN_MARGIN = 4;

export interface DropdownPanelProps {
  onCloseDropdown: () => void;
  onClickGoBack: () => void;
  canGoBack: boolean;
  anchor: HTMLElement;
  children: ReactNode;
  className?: string;
  title: ReactNode;
}

const DropdownPanelWrapper = tw.div`
  z-50
  absolute 
  flex 
  flex-col
  rounded-lg
  bg-white
  w-80 
  h-96 
  border 
  border-gray-300 
  shadow-lg
`;

const DropdownPanel = ({
  anchor,
  onCloseDropdown,
  children,
  canGoBack,
  onClickGoBack,
  title,
  className,
}: DropdownPanelProps) => {
  const [dropdownElement, setDropdownElement] = useState<HTMLElement>();
  useClickOutside({
    element: dropdownElement as HTMLElement,
    onClickOutside: (ev) => {
      if (!(anchor as Node).contains(ev.target as Node)) {
        onCloseDropdown();
      }
    },
  });
  return (
    <DropdownPanelWrapper
      ref={(el) => setDropdownElement(el as HTMLElement)}
      style={{ top: anchor.offsetTop + anchor.offsetHeight + DROPDOWN_MARGIN }}
      className={className}
    >
      <Button
        $variant="ghost"
        $shape="square"
        className="absolute right-4 top-2"
        onClick={onCloseDropdown}
      >
        <CloseIcon size={18} />
      </Button>
      {canGoBack && (
        <Button
          $variant="ghost"
          $shape="square"
          className="absolute left-4 top-2"
          onClick={onClickGoBack}
        >
          <BackIcon size={18} />
        </Button>
      )}
      <h4 className="mt-4 px-12 text-center">{title}</h4>
      <div className="mt-4 pb-4 flex-1 overflow-y-auto">{children}</div>
    </DropdownPanelWrapper>
  );
};

export default DropdownPanel;
