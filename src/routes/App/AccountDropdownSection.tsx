import { HTMLAttributes, ReactNode } from "react";

interface AccountDropdownSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  includeDivider?: boolean;
}

const AccountDropdownSection = ({
  children,
  includeDivider = true,
  ...props
}: AccountDropdownSectionProps) => {
  return (
    <div {...props}>
      {children}
      {includeDivider && <div className="h-[2px] bg-gray-300 my-1"></div>}
    </div>
  );
};

export default AccountDropdownSection;
