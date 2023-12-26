import { useState } from "react";
import Select from "react-select";
import Button from "../../../../components/Button";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";
import { BoardMember, BoardRole } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";

export interface MemberListProps {
  members: BoardMember[];
  currentUser: BriefProfile;
  onDeleteMember: (member: BoardMember) => Promise<void> | void;
}

type Option = { value: BoardRole; label: string };

const ADMIN_ROLE_OPTION: Option = {
  value: "ADMIN",
  label: "Admin",
};

const COLLABORATOR_ROLE_OPTION: Option = {
  value: "COLLABORATOR",
  label: "Collaborator",
};

const OBSERVER_ROLE_OPTION: Option = {
  value: "OBSERVER",
  label: "Observer",
};

const ROLE_OPTIONS: Option[] = [
  ADMIN_ROLE_OPTION,
  COLLABORATOR_ROLE_OPTION,
  OBSERVER_ROLE_OPTION,
];

export interface MemberListItemProps {
  member: BoardMember;
  currentUser: BriefProfile;
  onDeleteMember: (member: BoardMember) => Promise<void> | void;
}

const MemberListItem = ({
  currentUser,
  member,
  onDeleteMember,
}: MemberListItemProps) => {
  const [deleteBtnAnchor, setDeleteBtnAnchor] = useState<HTMLElement>();

  const handleDeleteMember = async (member: BoardMember) => {
    await onDeleteMember(member);
    setDeleteBtnAnchor(undefined);
  };

  return (
    <div
      key={member.id}
      className="hover:bg-gray-200 px-2 transition-all rounded"
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-none w-[36rem] items-center py-2">
          <div className="rounded-full w-8 h-8 mr-3">
            <img
              src={member.User.avatarUrl}
              className="flex-none object-center object-fill rounded-full"
            />
          </div>
          <span className="font-medium">{member.User.fullName}</span>
        </div>
        <div>
          <Select
            isSearchable={false}
            className="w-40"
            options={ROLE_OPTIONS}
            defaultValue={ROLE_OPTIONS.find(
              (opt) => opt.value === member.memberRole
            )}
          />
        </div>
        <div className="flex-1"></div>
        <div>
          {member.memberRole !== "ADMIN" &&
            member.User.email !== currentUser.email && (
              <Button
                onClick={(e) => setDeleteBtnAnchor(e.currentTarget)}
                $variant="danger"
              >
                Remove member
              </Button>
            )}
          {deleteBtnAnchor && (
            <DropdownRemoveAssertion
              anchor={deleteBtnAnchor}
              onClickDeleteConfirm={() => handleDeleteMember(member)}
              onCloseDropdown={() => setDeleteBtnAnchor(undefined)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const MemberList = ({
  currentUser,
  members,
  onDeleteMember,
}: MemberListProps) => {
  return (
    <div>
      <h2>Members</h2>
      <div>
        {members.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            currentUser={currentUser}
            onDeleteMember={onDeleteMember}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
