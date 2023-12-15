import { useState } from "react";
import BackIcon from "remixicon-react/ArrowLeftLineIcon";
import CloseIcon from "remixicon-react/CloseLineIcon";
import EditIcon from "remixicon-react/EditLineIcon";
import Button from "../../../../components/Button";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import useRefresh from "../../../../hooks/useRefresh";
import { Label } from "../../../../types/Board";
import { bgTextColorPair, getTextColor } from "../../../../utils/labelUtils";

export interface LabelsModalProps {
  selectedLabels: Label[];
  allLabels: Label[];
  onAddLabel: (label: Label) => Promise<void> | void;
  onRemoveLabel: (label: Label) => Promise<void> | void;
  onCreateLabel: (label: Pick<Label, "name" | "color">) => Promise<void> | void;
  onSaveEditLabel: (label: Label) => Promise<void> | void;
  onCloseModal: () => void;
  anchor: HTMLElement;
}

const MODAL_MARGIN = 4;

interface LabelListPanelProps {
  selectedLabels: Label[];
  allLabels: Label[];
  onAddLabel: (label: Label) => void;
  onRemoveLabel: (label: Label) => void;
  onClickEditLabel: (label: Label) => void;
  onClickCreateNewLabel: () => void;
}

const LabelListPanel = ({
  allLabels,
  onAddLabel,
  onRemoveLabel,
  onClickCreateNewLabel,
  onClickEditLabel,
  selectedLabels,
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
              onChange={() =>
                selectedLabels.some((l) => l.id === label.id)
                  ? onRemoveLabel(label)
                  : onAddLabel(label)
              }
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

          <Button
            onClick={() => onClickEditLabel(label)}
            $shape="square"
            $variant="ghost"
          >
            <EditIcon size={18} />
          </Button>
        </div>
      ))}
      <Button
        $variant="neutral"
        className="font-semibold block w-full mt-3 h-9 py-0"
        onClick={onClickCreateNewLabel}
      >
        Create a new label
      </Button>
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

interface LabelStackData {
  title?: string;
  element: () => JSX.Element;
}

const LabelsModal = ({
  allLabels,
  selectedLabels,
  anchor,
  onCloseModal,
  onAddLabel,
  onRemoveLabel,
  onCreateLabel,
  onSaveEditLabel,
}: LabelsModalProps) => {
  const refresh = useRefresh();

  const [panelStack, setPanelStack] = useState<LabelStackData[]>([
    {
      title: "Labels",
      element: () => (
        <LabelListPanel
          onClickEditLabel={handleClickEditBtn}
          allLabels={allLabels}
          selectedLabels={selectedLabels}
          onAddLabel={onAddLabel}
          onRemoveLabel={onRemoveLabel}
          onClickCreateNewLabel={() =>
            pushPanel({
              title: "Create label",
              element: (
                <LabelDetailPanel
                  mode="create"
                  onCreateLabel={async (label) => {
                    await onCreateLabel(label);
                    goBack();
                  }}
                />
              ),
            })
          }
        />
      ),
    },
  ]);
  const currentPanel = panelStack[panelStack.length - 1];

  function goBack() {
    setPanelStack((panelStack) => {
      if(panelStack.length > 1) {
        return panelStack.slice(0, -1)
      }
      return panelStack;
    });
      refresh();
    }

  function pushPanel(data: { title?: string; element: JSX.Element }) {
    setPanelStack((panelStack) => panelStack.concat({ ...data, element: () => data.element }))
    refresh();
  }

  function handleClickEditBtn(label: Label) {
    pushPanel({
      title: "Edit label",
      element: (
        <LabelDetailPanel
          label={label as Label}
          mode="edit"
          onRemoveLabel={async (label) => {
            await onRemoveLabel(label);
            goBack();
          }}
          onSaveLabel={async (label) => {
            await onSaveEditLabel(label);
            goBack();
          }}
        />
      ),
    });
  }

  return (
    <div
      style={{ top: anchor.offsetTop + anchor.offsetHeight + MODAL_MARGIN }}
      className="absolute flex flex-col rounded-lg bg-white w-80 h-96 border border-gray-300 shadow-lg"
    >
      <Button
        $variant="ghost"
        $shape="square"
        className="absolute right-4 top-2"
        onClick={onCloseModal}
      >
        <CloseIcon size={18} />
      </Button>
      {panelStack.length > 1 && (
        <Button
          $variant="ghost"
          $shape="square"
          className="absolute left-4 top-2"
          onClick={goBack}
        >
          <BackIcon size={18} />
        </Button>
      )}
      <h4 className="mt-4 px-12 text-center">{currentPanel.title}</h4>
      <div className="mt-4 pb-4 flex-1 overflow-y-auto">
        <currentPanel.element />
      </div>
    </div>
  );
};

export default LabelsModal;
