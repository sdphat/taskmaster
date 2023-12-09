import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DescriptionIcon from "remixicon-react/AlignLeftIcon";
import Button from "../../../../components/Button";
import { EventInfo } from "@ckeditor/ckeditor5-utils";
import { Line } from "./CardDetailModal";
import { useState } from "react";

export interface CardDescriptionProps {
  description: string;
  onSave: (description: string) => void;
}

const CardDescription = ({ description, onSave }: CardDescriptionProps) => {
  const [editingDescription, setEditingDescription] = useState(description);
  const [openDescriptionEditor, setOpenDescriptionEditor] = useState(false);

  function handleDescriptionChange(
    _event: EventInfo<string, unknown>,
    editor: ClassicEditor
  ): void {
    setEditingDescription(editor.getData());
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
          {!openDescriptionEditor && (
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
          <div>
            <div className="max-w-2xl">
              <CKEditor
                data={description}
                editor={ClassicEditor}
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
          <div>{description}</div>
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
