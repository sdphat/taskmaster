import { Attachment } from "../../../../types/Board";
import ArrowRightUpIcon from "remixicon-react/ArrowRightUpLineIcon";

export interface CardAttachmentItemProps {
  attachment: Attachment;
  onDelete: (attachment: Attachment) => Promise<void> | void;
}

const CardAttachmentItem = ({
  attachment,
  onDelete,
}: CardAttachmentItemProps) => {
  const isImage = attachment.type === "image";

  return (
    <div className="flex hover:bg-gray-200 transition-all text-ellipsis overflow-hidden whitespace-nowrap">
      <div className="w-32 h-20 rounded-sm flex-none">
        {isImage && (
          <img
            src={attachment.url}
            alt=""
            className="object-cover w-full h-full object-center"
          />
        )}
      </div>
      <div className="ml-3">
        <h3>
          {attachment.name}{" "}
          <a href={attachment.url} target="_blank">
            <ArrowRightUpIcon className="inline" size={16} />
          </a>
        </h3>
        <button
          className="underline cursor-pointer"
          onClick={() => onDelete(attachment)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CardAttachmentItem;
