import { ReactNode } from "react";

const ModalContainer = ({
  children,
  onClose,
}: {
  children?: ReactNode;
  onClose: () => void;
}) => {
  return (
    <div
      className="absolute left-0 top-0 w-screen h-screen overflow-auto flex justify-center py-24 bg-black bg-opacity-60"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
};

export default ModalContainer;
