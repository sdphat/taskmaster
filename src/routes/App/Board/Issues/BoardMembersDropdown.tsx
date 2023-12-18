import DropdownPanel from "../../../../components/DropdownPanel";
import FormInput from "../../../../components/FormInput";
import { BoardColumnCardMember, BoardMember } from "../../../../types/Board";
import CheckLineIcon from "remixicon-react/CheckLineIcon";

export interface BoardMembersDropdownProps {
  anchor: HTMLElement;
  onCloseDropdown: () => void;
  onAddMember: (cardMember: BoardMember) => void;
  onRemoveMember: (cardMember: BoardMember) => void;
  members: BoardMember[];
  selectedCardMembers: BoardColumnCardMember[];
}

const BoardMembersDropdown = ({
  anchor,
  onCloseDropdown,
  onAddMember,
  onRemoveMember,
  members,
  selectedCardMembers,
}: BoardMembersDropdownProps) => {
  return (
    <DropdownPanel
      anchor={anchor}
      canGoBack={false}
      onClickGoBack={() => {}}
      onCloseDropdown={onCloseDropdown}
      title="Members"
    >
      <div className="px-4">
        <FormInput placeholder="Search members" />
        <div className="mt-4">
          <h5>Board members</h5>
          <div className="mt-2 cursor-pointer select-none">
            {members.map((member) => {
              const isMemberIncluded = selectedCardMembers.some(
                (m) => m.Member.id === member.id
              );
              return (
                <div
                  onClick={() =>
                    isMemberIncluded
                      ? onRemoveMember(member)
                      : onAddMember(member)
                  }
                  key={member.id}
                  className="flex items-center hover:bg-gray-300 active:bg-gray-400 transition-all p-1 rounded-sm"
                >
                  <img
                    className="rounded-full w-8 h-8 select-none"
                    src={member.User.avatarUrl}
                  />
                  <div className="ml-2 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {member.User.fullName} ({member.User.email})
                  </div>
                  <div className="ml-4 w-5 mr-2">
                    {isMemberIncluded && <CheckLineIcon size={16} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DropdownPanel>
  );
};

export default BoardMembersDropdown;
