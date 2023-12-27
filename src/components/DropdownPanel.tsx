import { ReactNode, useState } from "react";
import BackIcon from "remixicon-react/ArrowLeftLineIcon";
import CloseIcon from "remixicon-react/CloseLineIcon";
import tw from "tailwind-styled-components";
import useClickOutside from "../hooks/useClickOutside";
import Button from "./Button";

const DROPDOWN_MARGIN = 4;

export type HorizontalPosition = "left" | "right" | "center";
export type VerticalPosition = "top" | "bottom" | "center";

export interface DropdownPanelProps {
  onCloseDropdown: () => void;
  onClickGoBack: () => void;
  canGoBack: boolean;
  anchor: HTMLElement;
  children: ReactNode;
  className?: string;
  title: ReactNode;
  x?: HorizontalPosition;
  y?: VerticalPosition;
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

const makeOffsetVerticalStyle = (
  y: VerticalPosition,
  anchor: HTMLElement
): React.CSSProperties => {
  if (y === "bottom") {
    return {
      top: anchor.offsetTop + anchor.offsetHeight + DROPDOWN_MARGIN,
      transform: "translateY(0)",
    };
  }
  if (y === "top") {
    return {
      top: anchor.offsetTop - DROPDOWN_MARGIN,
      transform: "translateY(-100%)",
    };
  }

  return {
    top: anchor.offsetTop + anchor.offsetHeight / 2,
    transform: "translateY(-50%)",
  };
};

const makeOffsetHorizontalStyle = (
  x: HorizontalPosition,
  anchor: HTMLElement
): React.CSSProperties => {
  if (x === "left") {
    return {
      left: anchor.offsetLeft - DROPDOWN_MARGIN,
      transform: "translateX(0)",
    };
  }
  if (x === "right") {
    return {
      left: anchor.offsetLeft + anchor.offsetWidth,
      transform: "translateX(-100%)",
    };
  }

  return {
    left: anchor.offsetLeft + anchor.offsetWidth / 2,
    transform: "translateX(-50%)",
  };
};

const DropdownPanel = ({
  anchor,
  onCloseDropdown,
  children,
  canGoBack,
  onClickGoBack,
  title,
  className,
  x = "left",
  y = "bottom",
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
      style={{
        ...makeOffsetVerticalStyle(y, anchor),
        ...makeOffsetHorizontalStyle(x, anchor),
        transform: `${makeOffsetHorizontalStyle(x, anchor).transform} ${
          makeOffsetVerticalStyle(y, anchor).transform
        }`,
      }}
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
