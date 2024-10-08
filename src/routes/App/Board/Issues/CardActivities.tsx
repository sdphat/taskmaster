import { formatDistance } from "date-fns";
import { ChangeEvent, useState } from "react";
import Markdown from "react-markdown";
import ActivityIcon from "remixicon-react/ListUnorderedIcon";
import Button from "../../../../components/Button";
import { BoardColumnCard, BoardRole } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";
import { Line } from "./CardDetailModal";

export interface CardActivitiesProps {
  profile: BriefProfile;
  comments: BoardColumnCard["Comments"];
  onSave: (comment: string) => void;
  role: BoardRole;
}

const CardActivities = ({
  profile,
  comments,
  onSave,
  role,
}: CardActivitiesProps) => {
  const [commentInput, setCommentInput] = useState("");
  const [openCommentEditor, setOpenCommentEditor] = useState(false);

  function handleCommentInputChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setCommentInput(e.currentTarget.value);
  }

  function handleSaveComment(): void {
    setCommentInput("");
    setOpenCommentEditor(false);
    onSave(commentInput);
  }

  function handleCancelComment(): void {
    setCommentInput("");
    setOpenCommentEditor(false);
  }
  return (
    <div>
      <Line leftContent={<ActivityIcon />} className="mb-2">
        <h3>Activity</h3>
      </Line>
      <div>
        <div>
          {role !== "OBSERVER" && (
            <Line
              className="items-start"
              leftContent={
                <img
                  src={profile.avatarUrl}
                  className="w-8 h-8 rounded-full object-cover object-center"
                />
              }
            >
              {openCommentEditor ? (
                <div className="w-full">
                  <div className="w-full">
                    <textarea
                      className="w-full border-gray-600 border rounded focus:outline-none p-2"
                      onChange={handleCommentInputChange}
                    />
                  </div>
                  <div className="mt-2">
                    <div className="space-x-2">
                      <Button onClick={handleSaveComment} $variant="primary">
                        Save
                      </Button>
                      <Button onClick={handleCancelComment} $variant="ghost">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  $variant="neutral"
                  className="font-semibold w-full h-16 inline-flex items-start"
                  onClick={() => setOpenCommentEditor(true)}
                >
                  Write a comment...
                </Button>
              )}
            </Line>
          )}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {comments.map((comment) => (
          <Line
            className="items-start"
            leftContent={
              <img
                src={comment.Creator.User.avatarUrl}
                className="w-8 h-8 rounded-full object-cover object-center"
              />
            }
            key={comment.id}
          >
            <div className="flex-1">
              <div>
                <span className="font-bold">
                  {comment.Creator.User.fullName}
                </span>
                <span className="text-xs ml-2">
                  {formatDistance(new Date(comment.createdDate), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="border border-gray-300 rounded bg-white w-full p-2 shadow-md">
                <Markdown>{comment.content}</Markdown>
              </div>
            </div>
          </Line>
        ))}
      </div>
    </div>
  );
};

export default CardActivities;
