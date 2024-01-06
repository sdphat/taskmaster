import { ChangeEvent, useRef, useState } from "react";
import CameraIcon from "remixicon-react/CameraLineIcon";
import Button from "../../../../components/Button";
import DropdownPanel from "../../../../components/DropdownPanel";
import FormInputError from "../../../../components/FormInputError";
import { useBoard } from "../../../../hooks/useBoard";
import usePanelStack from "../../../../hooks/usePanelStack";
import useRemoveAttachmentMutation from "../../../../hooks/useRemoveAttachmentMutation";
import useSendAttachmentMutation from "../../../../hooks/useSendAttachmentMutation";
import { useUpdateBoardMutation } from "../../../../hooks/useUpdateBoardMutation";
import { updateBoard } from "../../../../slices/BoardSlice";
import { useAppDispatch } from "../../../../store";
import { BoardRole } from "../../../../types/Board";

export interface BoardOptionDropdownProps {
  anchor: HTMLElement;
  role: BoardRole;
  onCloseDropdown: () => void;
}

type PanelType = "options" | "setBackground";

interface BoardOptionPanelProps {
  onClickSetBackgroundOption: () => void;
}

const BoardOptionPanel = ({
  onClickSetBackgroundOption,
}: BoardOptionPanelProps) => {
  return (
    <button
      onClick={onClickSetBackgroundOption}
      className="w-full text-left px-4 py-2 hover:bg-gray-200 active:bg-gray-300 rounded-sm"
    >
      Set background
    </button>
  );
};

interface SetBackgroundPanelProps {
  backgroundUrl?: string;
  onSetBackground: (file: File) => Promise<void> | void;
  onRemoveBackground: () => Promise<void> | void;
}

const SetBackgroundPanel = ({
  backgroundUrl,
  onRemoveBackground,
  onSetBackground,
}: SetBackgroundPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function handleChangeFile(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.currentTarget.files![0];
    const allowedFileTypes = ["image/png", "image/jpeg"];
    if (!allowedFileTypes.includes(file.type)) {
      setError("Only .png and .jpeg is supported.");
      return;
    }

    // 50 MB
    if (file.size >= 50000000) {
      setError("File cannot exceed 50MB.");
      return;
    }

    await onSetBackground(file);
  }

  return (
    <div>
      <div className="relative h-36 group cursor-pointer">
        <input
          ref={fileInputRef}
          onChange={handleChangeFile}
          type="file"
          name="attachment"
          accept="image/png,image/jpeg"
          className="hidden"
        />
        {backgroundUrl ? (
          <>
            <img
              src={backgroundUrl}
              alt=""
              className="w-full h-36 object-cover object-center"
            />
            <div
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="absolute inset-0 grid place-items-center group-hover:opacity-60 opacity-0 bg-gray-200 transition-all"
            >
              <CameraIcon className="" size={36} />
            </div>
          </>
        ) : (
          <Button
            className="mx-4"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            Add background
          </Button>
        )}
      </div>
      <FormInputError className="mx-4">{error}</FormInputError>
      {backgroundUrl && (
        <Button
          onClick={onRemoveBackground}
          $variant="danger"
          className="mx-4 mt-2"
        >
          Remove background
        </Button>
      )}
    </div>
  );
};

const BoardOptionDropdown = ({
  anchor,
  role,
  onCloseDropdown,
}: BoardOptionDropdownProps) => {
  const { board } = useBoard();
  const dispatch = useAppDispatch();
  const updateBoardBgMutation = useUpdateBoardMutation();
  const sendAttachmentMutation = useSendAttachmentMutation();
  const removeAttachmentMutation = useRemoveAttachmentMutation();
  const { panelStack, currentPanel, goBack, pushPanel } =
    usePanelStack<PanelType>({
      rootPanel: { panelType: "options", title: "Options" },
    });

  const handleClickSetBackgroundOption = () => {
    pushPanel({ panelType: "setBackground", title: "Background" });
  };

  const handleSetBackground = async (file: File) => {
    const attachment = await sendAttachmentMutation.mutateAsync({ file });
    await updateBoardBgMutation.mutateAsync({
      id: board!.id,
      backgroundUrl: attachment.url,
    });

    // For type safe purpose
    if (!board) {
      return;
    }
    dispatch(updateBoard({ ...board, background: attachment }));
  };

  const handleRemoveBackground = async () => {
    if (!board?.background) {
      return;
    }

    await removeAttachmentMutation.mutateAsync({
      url: board.background.url,
    });

    // For type safe purpose
    if (!board) {
      return;
    }
    dispatch(updateBoard({ ...board, background: undefined }));
  };

  if (!board) {
    return <></>;
  }

  if (role === "OBSERVER") {
    return;
  }

  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={panelStack.length > 1}
      onCloseDropdown={onCloseDropdown}
      onClickGoBack={goBack}
      title={currentPanel.title}
      x="right"
      y="bottom"
      className="h-max max-h-80"
    >
      {currentPanel.panelType === "options" && (
        <BoardOptionPanel
          onClickSetBackgroundOption={handleClickSetBackgroundOption}
        />
      )}
      {currentPanel.panelType === "setBackground" && (
        <SetBackgroundPanel
          backgroundUrl={board.background?.url}
          onSetBackground={handleSetBackground}
          onRemoveBackground={handleRemoveBackground}
        />
      )}
    </DropdownPanel>
  );
};

export default BoardOptionDropdown;
