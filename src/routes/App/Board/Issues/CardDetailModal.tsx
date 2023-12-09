import { HTMLAttributes, ReactNode } from "react";
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
import ModalContainer from "../../../../components/ModalContainer";
import { BoardColumn, BoardColumnCard } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";
import CardDescription from "./CardDescription";
import CardActivities from "./CardActivities";
export interface CardDetailModalProps {
  card: BoardColumnCard;
  profile: BriefProfile;
  columnCard: BoardColumn;
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

export const CARD_PADDING = "px-4";
export const actionIconSize = 16;

export const CardDetailModal = ({
  card,
  columnCard,
  profile,
  onClose,
}: CardDetailModalProps) => {
  function handleSaveComment(comment: string): void {
    console.log(comment);
  }

  function handleSaveDescription(newDescription: string): void {
    console.log(newDescription);
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-lg max-w-5xl w-full pt-4 pb-8 h-max">
        {/* Card header */}
        <div className="mb-6">
          <div className={`${CARD_PADDING}`}>
            <div>
              <Line leftContent={<HeaderIcon />}>
                <h2 className="break-all text-2xl flex items-center">
                  {card.summary}
                </h2>
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
                <ActionButton icon={<LabelIcon size={actionIconSize} />}>
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
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CardDetailModal;
