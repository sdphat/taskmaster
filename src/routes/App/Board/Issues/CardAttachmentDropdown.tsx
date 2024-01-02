import { ChangeEvent, useRef, useState } from "react";
import Button from "../../../../components/Button";
import DropdownPanel from "../../../../components/DropdownPanel";
import FormInputError from "../../../../components/FormInputError";

export interface CardAttachmentDropdownProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onFileChange: (file: File) => Promise<void> | void;
}

const CardAttachmentDropdown = ({
  anchor,
  onCloseDropdown,
  onFileChange,
}: CardAttachmentDropdownProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isBlockClosingOneTime, setBlockClosingOneTime] = useState(false);

  async function handleChangeFile(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.currentTarget.files![0];
    const allowedFileTypes = ["image/png", "image/jpeg"];
    if (!allowedFileTypes.includes(file.type)) {
      setError("Only .png and .jpeg is supported.");
      setBlockClosingOneTime(true);
      return;
    }

    // 50 MB
    if (file.size >= 50000000) {
      setError("File cannot exceed 50MB.");
      setBlockClosingOneTime(true);
      return;
    }

    await onFileChange(file);
    onCloseDropdown();
  }

  function handleCloseDropdown() {
    if (isBlockClosingOneTime) {
      setBlockClosingOneTime(false);
      return;
    }
    onCloseDropdown();
  }

  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={false}
      onClickGoBack={() => {}}
      onCloseDropdown={handleCloseDropdown}
      title="Attach"
      className="h-max max-h-80 px-2"
    >
      <h3>Attach a file from your computer</h3>

      <input
        ref={inputRef}
        onChange={handleChangeFile}
        type="file"
        name="attachment"
        accept="image/png,image/jpeg"
        className="hidden"
      />
      <Button
        onClick={() => inputRef.current?.click()}
        className="w-full mt-2 font-medium"
        $variant="neutral"
      >
        Choose a file
      </Button>
      <FormInputError>{error}</FormInputError>
    </DropdownPanel>
  );
};

export default CardAttachmentDropdown;
