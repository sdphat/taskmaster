import { useState } from "react";
import EditIcon from "remixicon-react/EditLineIcon";
import Button from "../../../../components/Button";
import DropdownPanel from "../../../../components/DropdownPanel";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import usePanelStack from "../../../../hooks/usePanelStack";
import { BoardRole, Label } from "../../../../types/Board";
import { bgTextColorPair, getTextColor } from "../../../../utils/labelUtils";

export interface LabelsModalProps {
  selectedLabels: Label[];
  allLabels: Label[];
  onAddLabel: (label: Label) => Promise<void> | void;
  onUnaddLabel: (label: Label) => Promise<void> | void;
  onRemoveLabel: (label: Label) => Promise<void> | void;
  onCreateLabel: (label: Pick<Label, "name" | "color">) => Promise<void> | void;
  onSaveEditLabel: (label: Label) => Promise<void> | void;
  onCloseDropdown: () => void;
  anchor: HTMLElement;
  role: BoardRole;
}
interface LabelListPanelProps {
  selectedLabels: Label[];
  allLabels: Label[];
  role: BoardRole;
  onAddLabel: (label: Label) => void;
  onUnaddLabel: (label: Label) => void;
  onClickEditLabel: (label: Label) => void;
  onClickCreateNewLabel: () => void;
}

const LabelListPanel = ({
  allLabels,
  onAddLabel,
  onUnaddLabel,
  onClickCreateNewLabel,
  onClickEditLabel,
  selectedLabels,
  role,
}: LabelListPanelProps) => (
  <>
    <div className="px-4 pb-2 mt-4 flex-1 min-w-0 overflow-y-auto">
      {allLabels.map((label) => (
        <div key={label.id} className="flex gap-2 items-center mb-1">
          <label
            className="flex-1 min-w-0 flex items-center gap-2"
            htmlFor={String(label.id)}
          >
            <input
              checked={selectedLabels.some((l) => l.id === label.id)}
              disabled={role === "OBSERVER"}
              onChange={() => {
                if (role === "OBSERVER") {
                  return;
                }
                selectedLabels.some((l) => l.id === label.id)
                  ? onUnaddLabel(label)
                  : onAddLabel(label);
              }}
              id={String(label.id)}
              type="checkbox"
              className="w-4 h-4"
            />
            <span
              style={{
                background: label.color,
                color: getTextColor(label.color)?.textColor,
              }}
              className="inline-flex flex-1 min-w-0 font-semibold items-center h-8 py-0 px-4 text-left rounded cursor-pointer select-none overflow-hidden whitespace-nowrap text-ellipsis"
            >
              <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                {label.name}
              </span>
            </span>
          </label>

          {role !== "OBSERVER" && (
            <Button
              onClick={() => onClickEditLabel(label)}
              $shape="square"
              $variant="ghost"
            >
              <EditIcon size={18} />
            </Button>
          )}
        </div>
      ))}
      {role !== "OBSERVER" && (
        <Button
          $variant="neutral"
          className="font-semibold block w-full mt-3 h-9 py-0"
          onClick={onClickCreateNewLabel}
        >
          Create a new label
        </Button>
      )}
    </div>
  </>
);

type LabelDetailPanelProps =
  | {
      onCreateLabel: (label: Pick<Label, "color" | "name">) => void;
      mode: "create";
    }
  | {
      label: Label;
      onSaveLabel: (label: Label) => void;
      onRemoveLabel: (label: Label) => void;
      mode: "edit";
    };

const LabelDetailPanel = (props: LabelDetailPanelProps) => {
  const [label, setLabel] = useState<
    typeof props.mode extends "edit" ? Label : Pick<Label, "color" | "name">
  >(
    props.mode === "create"
      ? {
          color: bgTextColorPair[0].background,
          name: "",
        }
      : props.label
  );

  return (
    <>
      <div className="flex items-center px-8 bg-gray-100 h-24">
        <span
          style={{
            background: label.color,
            color: getTextColor(label.color)?.textColor,
          }}
          className="inline-flex flex-1 min-w-0 font-semibold items-center 
              h-8 py-0 px-4 text-left rounded select-none
              overflow-hidden whitespace-nowrap text-ellipsis"
        >
          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
            {label.name}
          </span>
        </span>
      </div>
      <div className="mt-2 px-4">
        <FormField>
          <FormLabel className="text-xs font-semibold mb-1">Title</FormLabel>
          <FormInput
            onChange={(e) => setLabel({ ...label, name: e.target.value })}
            value={label.name}
          />
        </FormField>
        <div className="text-xs font-semibold mb-1">Select a color</div>
        <div className="grid gap-2 grid-cols-5 mt-2">
          {bgTextColorPair.map((pair) => (
            <span
              key={pair.background}
              style={{ background: pair.background }}
              className={`h-8 rounded-sm cursor-pointer ${
                label.color === pair.background
                  ? "ring-2 ring-offset-1 ring-blue-700"
                  : ""
              }`}
              onClick={() => setLabel({ ...label, color: pair.background })}
            />
          ))}
        </div>
        <div className="h-[1px] bg-gray-300 my-4"></div>
        {props.mode === "create" && (
          <Button onClick={() => props.onCreateLabel(label)} className="w-full">
            Create
          </Button>
        )}
        {props.mode === "edit" && (
          <div className="flex justify-between">
            <Button onClick={() => props.onSaveLabel(label as Label)}>
              Save
            </Button>
            <Button
              onClick={() => props.onRemoveLabel(label as Label)}
              $variant="danger"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

type PanelType = "create" | "edit" | "list";

const LabelsDropdown = ({
  allLabels,
  selectedLabels,
  anchor,
  role,
  onCloseDropdown,
  onAddLabel,
  onRemoveLabel,
  onCreateLabel,
  onSaveEditLabel,
  onUnaddLabel,
}: LabelsModalProps) => {
  const { panelStack, currentPanel, goBack, pushPanel } =
    usePanelStack<PanelType>({
      rootPanel: { panelType: "list", title: "Labels" },
    });
  const [editingLabel, setEditingLabel] = useState<Label | undefined>(
    undefined
  );

  function handleClickEditBtn(label: Label) {
    pushPanel({
      title: "Edit label",
      panelType: "edit",
    });
    setEditingLabel(label);
  }

  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={panelStack.length > 1}
      onClickGoBack={goBack}
      onCloseDropdown={onCloseDropdown}
      title={currentPanel.title}
    >
      <>
        {currentPanel.panelType === "list" && (
          <LabelListPanel
            onClickEditLabel={handleClickEditBtn}
            allLabels={allLabels}
            selectedLabels={selectedLabels}
            onAddLabel={onAddLabel}
            onUnaddLabel={onUnaddLabel}
            onClickCreateNewLabel={() =>
              pushPanel({
                title: "Create label",
                panelType: "create",
              })
            }
            role={role}
          />
        )}

        {currentPanel.panelType === "edit" && (
          <LabelDetailPanel
            label={editingLabel as Label}
            mode="edit"
            onRemoveLabel={async (label) => {
              await onRemoveLabel(label);
              setEditingLabel(undefined);
              goBack();
            }}
            onSaveLabel={async (label) => {
              await onSaveEditLabel(label);
              setEditingLabel(undefined);
              goBack();
            }}
          />
        )}

        {currentPanel.panelType === "create" && (
          <LabelDetailPanel
            mode="create"
            onCreateLabel={async (label) => {
              await onCreateLabel(label);
              goBack();
            }}
          />
        )}
      </>
    </DropdownPanel>
  );
};

export default LabelsDropdown;
