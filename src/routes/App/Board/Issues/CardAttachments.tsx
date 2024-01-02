import AttachmentIcon from "remixicon-react/Attachment2Icon";
import { Attachment } from "../../../../types/Board";
import CardAttachmentItem from "./CardAttachmentItem";
import { Line } from "./CardDetailModal";
import { useState } from "react";
import Button from "../../../../components/Button";

export interface CardAttachmentsProps {
  attachments: Attachment[];
  onDelete: (attachment: Attachment) => Promise<void> | void;
}

const CardAttachments = ({ attachments, onDelete }: CardAttachmentsProps) => {
  const [showMore, setShowMore] = useState(false);

  if (!attachments.length) {
    return <></>;
  }

  const displayAttachments = showMore ? attachments : attachments.slice(0, 5);
  const canShowMore = attachments.length > 5;
  const remainingAttachment = attachments.length - 5;

  return (
    <div>
      <Line leftContent={<AttachmentIcon />}>
        <h3>Attachments</h3>
      </Line>
      <Line>
        <div className="mt-1 space-y-3 flex-1">
          {displayAttachments.map((attachment) => (
            <CardAttachmentItem
              key={attachment.id}
              attachment={attachment}
              onDelete={onDelete}
            />
          ))}
        </div>
      </Line>
      <Line className="mt-4">
        {canShowMore && (
          <>
            {showMore ? (
              <Button
                onClick={() => setShowMore(false)}
                $variant="neutral"
                className="w-full font-medium"
              >
                Show less
              </Button>
            ) : (
              <Button
                onClick={() => setShowMore(true)}
                $variant="neutral"
                className="w-full font-medium"
              >
                Show {remainingAttachment} more attachment
                {remainingAttachment > 1 ? "s" : ""}
              </Button>
            )}
          </>
        )}
      </Line>
    </div>
  );
};

export default CardAttachments;
