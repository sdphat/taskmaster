import {
  FocusEvent,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useRef,
} from "react";
import AttachmentIcon from "remixicon-react/Attachment2Icon";
import ChecklistIcon from "remixicon-react/CheckboxLineIcon";
import RemoveIcon from "remixicon-react/DeleteBinLineIcon";
import WatchIcon from "remixicon-react/EyeLineIcon";
import CoverIcon from "remixicon-react/ImageLineIcon";
import LabelIcon from "remixicon-react/PriceTag3LineIcon";
import ShareIcon from "remixicon-react/ShareLineIcon";
import DatesIcon from "remixicon-react/TimeLineIcon";
import MemberIcon from "remixicon-react/UserLineIcon";
import HeaderIcon from "remixicon-react/Window2LineIcon";
import tw from "tailwind-styled-components";
import Button, { ButtonProps } from "../../../../components/Button";
import FormInput from "../../../../components/FormInput";
import ModalContainer from "../../../../components/ModalContainer";
import useRefresh from "../../../../hooks/useRefresh";
import { BoardColumn, BoardColumnCard, Label } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";
import CardActivities from "./CardActivities";
import CardDescription from "./CardDescription";
import CardLabels from "./CardLabels";
import LabelsModal from "./LabelsDropdown";
import axiosInstance from "../../../../api/axios";
import { useMutation } from "react-query";
import { useAppDispatch } from "../../../../store";
import {
  createLabel,
  updateLabel,
  updateLabelList,
} from "../../../../slices/BoardSlice";
export interface CardDetailModalProps {
  boardId: number;
  card: BoardColumnCard;
  profile: BriefProfile;
  columnCard: BoardColumn;
  allLabels: Label[];
  onSaveTitle: (title: string) => void;
  onSaveComment: (comment: string) => void;
  onSaveDescription: (description: string) => void;
  onClose: () => void;
}

interface ActionButtonProps extends ButtonProps {
  icon: ReactNode;
}

export const ActionButton = ({
  icon,
  children,
  ...props
}: ActionButtonProps) => (
  <Button
    $variant="neutral"
    className="flex items-center h-8 rounded-sm"
    {...props}
  >
    <div className="w-5 mr-1 flex-none">{icon}</div>
    <h4>{children}</h4>
  </Button>
);

interface LineProps extends HTMLAttributes<HTMLDivElement> {
  leftContent?: ReactNode;
  children?: ReactNode;
}

const LineDiv = tw.div`flex items-center`;

export const Line = ({ leftContent, children, ...props }: LineProps) => (
  <LineDiv {...props}>
    <div className="w-8 flex-none mr-2">{leftContent}</div>
    {children}
  </LineDiv>
);

const CARD_PADDING = "px-4";
const actionIconSize = 16;

interface CreateLabelArgs {
  boardId: number;
  name: string;
  color: string;
}
interface UpdateLabelArgs {
  id: number;
  name: string;
  color: string;
}

interface UpdateLabelListArgs {
  cardId: number;
  labelIds: number[];
}

export const CardDetailModal = ({
  boardId,
  card,
  columnCard,
  allLabels,
  profile,
  onClose,
  onSaveTitle,
  onSaveDescription,
  onSaveComment,
}: CardDetailModalProps) => {
  const refresh = useRefresh();
  const labelDropdownAnchorRef = useRef<HTMLElement>();
  const dispatch = useAppDispatch();

  const createLabelMutation = useMutation({
    async mutationFn(args: CreateLabelArgs): Promise<Label> {
      return (await axiosInstance.post("/card-label", args)).data;
    },
  });

  const updateLabelMutation = useMutation({
    async mutationFn({ id, ...updateData }: UpdateLabelArgs) {
      return (await axiosInstance.put(`/card-label/${id}`, updateData)).data;
    },
  });

  const addLabelMutation = useMutation({
    async mutationFn({ cardId, labelIds }: UpdateLabelListArgs) {
      return (
        await axiosInstance.put(`/board-card`, { cardId, labels: labelIds })
      ).data;
    },
  });

  function handleSaveComment(comment: string): void {
    onSaveComment(comment);
  }

  function handleSaveDescription(newDescription: string): void {
    onSaveDescription(newDescription);
  }

  function handleSaveTitle(event: FocusEvent<HTMLInputElement, Element>): void {
    onSaveTitle(event.target.value);
  }

  async function handleAddLabel(label: Label): Promise<void> {
    const payload = {
      cardId: card.id,
      labelIds: card.Labels.map((lbl) => lbl.id).concat(label.id),
    };
    await addLabelMutation.mutateAsync(payload);

    dispatch(updateLabelList(payload));
  }

  async function handleRemoveLabel(label: Label): Promise<void> {
    const payload = {
      cardId: card.id,
      labelIds: card.Labels.filter((lbl) => lbl.id !== label.id).map(
        (lbl) => lbl.id
      ),
    };

    await addLabelMutation.mutateAsync(payload);
    dispatch(updateLabelList(payload));
  }

  async function handleCreateLabel(
    label: Pick<Label, "name" | "color">
  ): Promise<void> {
    const newLabel = await createLabelMutation.mutateAsync({
      boardId,
      ...label,
    });
    dispatch(createLabel(newLabel));
  }

  async function handleSaveEditLabel(label: Label): Promise<void> {
    await updateLabelMutation.mutateAsync(label);
    dispatch(updateLabel(label));
  }

  function handleLabelBtnCLick(event: MouseEvent<HTMLButtonElement>): void {
    labelDropdownAnchorRef.current !== event.currentTarget
      ? (labelDropdownAnchorRef.current = event.currentTarget)
      : (labelDropdownAnchorRef.current = undefined);
    refresh();
  }

  function handleCloseLabelModal(): void {
    labelDropdownAnchorRef.current = undefined;
    refresh();
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-lg max-w-5xl w-full pt-4 pb-8 h-max">
        {/* Card header */}
        <div className="mb-6">
          <div className={`${CARD_PADDING}`}>
            <div>
              <Line leftContent={<HeaderIcon />}>
                <FormInput
                  defaultValue={card.summary}
                  onBlur={handleSaveTitle}
                  className="break-all text-2xl font-semibold flex items-center border-transparent -ml-2"
                />
              </Line>
              <Line className="text-sm">
                in list&nbsp;{" "}
                <span className="underline">{columnCard.name}</span>
              </Line>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className={`flex ${CARD_PADDING}`}>
          <div className="flex-1 space-y-6 pr-4">
            <CardLabels labels={card.Labels} />
            <CardDescription
              description={card.description}
              onSave={handleSaveDescription}
              key={card.description}
            />
            <CardActivities
              comments={card.Comments}
              onSave={handleSaveComment}
              profile={profile}
            />
          </div>

          {/* Action buttons */}
          <div className="flex-none w-48 space-y-8">
            <div>
              <h5 className="mb-2 text-[#44546f]">Add to card</h5>
              <div className="flex flex-col items-stretch gap-2">
                <ActionButton icon={<WatchIcon size={actionIconSize} />}>
                  Watch
                </ActionButton>
                <ActionButton icon={<MemberIcon size={actionIconSize} />}>
                  Members
                </ActionButton>
                <ActionButton
                  onClick={handleLabelBtnCLick}
                  icon={<LabelIcon size={actionIconSize} />}
                >
                  Labels
                </ActionButton>
                <ActionButton icon={<ChecklistIcon size={actionIconSize} />}>
                  Checklist
                </ActionButton>
                <ActionButton icon={<DatesIcon size={actionIconSize} />}>
                  Dates
                </ActionButton>
                <ActionButton icon={<AttachmentIcon size={actionIconSize} />}>
                  Attachments
                </ActionButton>
                <ActionButton icon={<CoverIcon size={actionIconSize} />}>
                  Cover
                </ActionButton>
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-[#44546f]">Actions</h5>
              <div className="flex flex-col items-stretch gap-2">
                <ActionButton icon={<ShareIcon size={actionIconSize} />}>
                  Share
                </ActionButton>
                <ActionButton
                  icon={<RemoveIcon size={actionIconSize} />}
                  $variant="danger"
                >
                  Remove
                </ActionButton>
              </div>
              {labelDropdownAnchorRef?.current !== undefined && (
                <LabelsModal
                  onCloseModal={handleCloseLabelModal}
                  onCreateLabel={handleCreateLabel}
                  onSaveEditLabel={handleSaveEditLabel}
                  anchor={labelDropdownAnchorRef.current as HTMLElement}
                  allLabels={allLabels}
                  onAddLabel={handleAddLabel}
                  onRemoveLabel={handleRemoveLabel}
                  selectedLabels={card.Labels}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CardDetailModal;
