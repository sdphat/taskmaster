import React from "react";
import { Line } from "./CardDetailModal";
import { BoardColumnCardMember } from "../../../../types/Board";

export interface CardMembersProps {
  cardMembers: BoardColumnCardMember[];
}

const CardMembers = ({ cardMembers }: CardMembersProps) => {
  return (
    <Line>
      <div>
        <h3>Members</h3>
        <div className="mt-1 flex gap-1 flex-wrap">
          {cardMembers.map((member) => (
            <img
              key={member.boardMemberId}
              src={member.Member.User.avatarUrl}
              className="rounded-full w-8 h-8"
            />
          ))}
        </div>
      </div>
    </Line>
  );
};

export default CardMembers;
