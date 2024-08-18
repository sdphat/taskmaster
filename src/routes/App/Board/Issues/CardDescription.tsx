import DescriptionIcon from "remixicon-react/AlignLeftIcon";
import Button from "../../../../components/Button";
import { Line } from "./CardDetailModal";
import { ChangeEvent, useState } from "react";
import MarkdownComponent from "react-markdown";
import { BoardRole } from "../../../../types/Board";

export interface CardDescriptionProps {
  description: string;
  onSave: (description: string) => void;
  role: BoardRole;
}

const CardDescription = ({
  description,
  onSave,
  role,
}: CardDescriptionProps) => {
  const [editingDescription, setEditingDescription] = useState(description);
  const [openDescriptionEditor, setOpenDescriptionEditor] = useState(false);

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>
  ): void {
    setEditingDescription(e.currentTarget.value);
  }

  function handleSaveDescription(): void {
    setEditingDescription("");
    setOpenDescriptionEditor(false);
    onSave(editingDescription);
  }

  function handleCancelDescription(): void {
    setEditingDescription("");
    setOpenDescriptionEditor(false);
  }

  return (
    <div>
      <Line leftContent={<DescriptionIcon />}>
        <div className="flex flex-1 items-center justify-between">
          <h3>Description</h3>
          {!openDescriptionEditor && role !== "OBSERVER" && (
            <Button
              $variant="neutral"
              onClick={() => setOpenDescriptionEditor(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </Line>
      <Line className="mt-1">
        {openDescriptionEditor ? (
          <div className="w-full">
            <div className="w-full">
              <textarea
                className="w-full border-gray-600 border rounded focus:outline-none p-2"
                value={editingDescription}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className="mt-2">
              <div className="space-x-2">
                <Button onClick={handleSaveDescription} $variant="primary">
                  Save
                </Button>
                <Button onClick={handleCancelDescription} $variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : description.length > 0 ? (
          <div>
            <MarkdownComponent>{description}</MarkdownComponent>
          </div>
        ) : (
          <Button
            $variant="neutral"
            className="font-semibold w-full h-16 inline-flex items-start"
            onClick={() => setOpenDescriptionEditor(true)}
          >
            Add a detailed description...
          </Button>
        )}
      </Line>
    </div>
  );
};

export default CardDescription;
