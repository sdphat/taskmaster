import { HTMLAttributes, ReactNode } from "react";
import DescriptionIcon from "remixicon-react/AlignLeftIcon";
import AttachmentIcon from "remixicon-react/Attachment2Icon";
import ChecklistIcon from "remixicon-react/CheckboxLineIcon";
import RemoveIcon from "remixicon-react/DeleteBinLineIcon";
import WatchIcon from "remixicon-react/EyeLineIcon";
import CoverIcon from "remixicon-react/ImageLineIcon";
import ActivityIcon from "remixicon-react/ListUnorderedIcon";
import LabelIcon from "remixicon-react/PriceTag3LineIcon";
import ShareIcon from "remixicon-react/ShareLineIcon";
import DatesIcon from "remixicon-react/TimeLineIcon";
import MemberIcon from "remixicon-react/UserLineIcon";
import HeaderIcon from "remixicon-react/Window2LineIcon";
import Button, { ButtonProps } from "../../../../components/Button";
import FormInput from "../../../../components/FormInput";
import ModalContainer from "../../../../components/ModalContainer";
import { BoardColumn, BoardColumnCard } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";
import tw from "tailwind-styled-components";

export interface CardDetailModalProps {
  card: BoardColumnCard;
  profile: BriefProfile;
  columnCard: BoardColumn;
  onClose: () => void;
}

interface ActionButtonProps extends ButtonProps {
  icon: ReactNode;
}

const ActionButton = ({ icon, children, ...props }: ActionButtonProps) => (
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

const Line = ({ leftContent, children, ...props }: LineProps) => (
  <LineDiv {...props}>
    <div className="w-8 flex-none mr-2">{leftContent}</div>
    {children}
  </LineDiv>
);

const CARD_PADDING = "px-4";
const actionIconSize = 16;

const CardDetailModal = ({
  card,
  columnCard,
  profile,
  onClose,
}: CardDetailModalProps) => {
  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full pt-4 pb-8 h-max">
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
            <div>
              <Line leftContent={<DescriptionIcon />}>
                <h3>Description</h3>
              </Line>
              <Line>{card.description}</Line>
            </div>
            <div>
              <Line leftContent={<ActivityIcon />} className="mb-2">
                <h3>Activity</h3>
              </Line>
              <div>
                <div>
                  <Line
                    className="items-start"
                    leftContent={
                      <img src={profile.avatarUrl} className="w-8 h-8" />
                    }
                  >
                    <FormInput placeholder="Write a comment" />
                  </Line>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {card.Comments.map((comment) => (
                  <Line
                    className="items-start"
                    leftContent={
                      <img
                        src={comment.Creator.avatarUrl}
                        className="w-8 h-8"
                      />
                    }
                  >
                    <div className="flex-1">
                      <div>
                        <span className="font-bold">
                          {comment.Creator.fullName}
                        </span>
                        <span className="text-xs ml-2">7 minutes ago</span>
                      </div>
                      <div className="border border-gray-300 rounded bg-white w-full p-2 shadow-md">
                        {comment.content}
                      </div>
                    </div>
                  </Line>
                ))}
              </div>
            </div>
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
