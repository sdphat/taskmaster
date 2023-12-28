import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { ZodError, z } from "zod";
import Button from "../../../../components/Button";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormInputError from "../../../../components/FormInputError";
import { BoardMember, BoardRole } from "../../../../types/Board";
import { BriefProfile } from "../../../../types/BriefProfile";

interface OnAddMemberData {
  memberRole: BoardRole;
  email: string;
}

export interface MemberListProps {
  members: BoardMember[];
  currentUser: BriefProfile;
  onDeleteMember: (member: BoardMember) => Promise<void> | void;
  onAddMember: (args: OnAddMemberData) => Promise<void> | void;
  onChangeRole: (member: BoardMember) => Promise<void> | void;
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
  userRole: BoardRole;
  onDeleteMember: (member: BoardMember) => Promise<void> | void;
  onChangeRole: (member: BoardMember) => Promise<void> | void;
}

const MemberListItem = ({
  currentUser,
  member,
  userRole,
  onDeleteMember,
  onChangeRole,
}: MemberListItemProps) => {
  const [deleteBtnAnchor, setDeleteBtnAnchor] = useState<HTMLElement>();

  const handleDeleteMember = async (member: BoardMember) => {
    await onDeleteMember(member);
    setDeleteBtnAnchor(undefined);
  };

  const handleChangeRole = (option: SingleValue<Option>) => {
    if (option) {
      onChangeRole({ ...member, memberRole: option.value });
    }
  };

  const isSameUser = member.User.email === currentUser.email;

  const isAllowedToEdit = !isSameUser && userRole === "ADMIN";

  return (
    <div
      key={member.id}
      className="hover:bg-gray-200 px-2 py-1 transition-all rounded"
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-none w-[36rem] items-center py-2">
          <div className="rounded-full w-9 h-9 flex-none mr-3">
            <img
              src={member.User.avatarUrl}
              className="flex-none object-center object-fill rounded-full"
            />
          </div>
          <div className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
            <div className="font-medium overflow-hidden whitespace-nowrap text-ellipsis pr-12">
              {member.User.fullName}
            </div>
            <div className="text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis">
              {member.User.email}
            </div>
          </div>
        </div>

        <div className="flex-1"></div>
        <div className="w-40">
          {isAllowedToEdit ? (
            <Select
              isSearchable={false}
              className="w-full"
              options={ROLE_OPTIONS}
              onChange={handleChangeRole}
              defaultValue={ROLE_OPTIONS.find(
                (opt) => opt.value === member.memberRole
              )}
            />
          ) : (
            <span className="px-2 font-medium">
              {
                ROLE_OPTIONS.find((opt) => opt.value === member.memberRole)
                  ?.label
              }
            </span>
          )}
        </div>

        {isAllowedToEdit && (
          <>
            <div className="flex-1"></div>
            <div>
              <Button
                onClick={(e) => setDeleteBtnAnchor(e.currentTarget)}
                $variant="danger"
              >
                Remove member
              </Button>

              {deleteBtnAnchor && (
                <DropdownRemoveAssertion
                  x="right"
                  y="bottom"
                  anchor={deleteBtnAnchor}
                  onClickDeleteConfirm={() => handleDeleteMember(member)}
                  onCloseDropdown={() => setDeleteBtnAnchor(undefined)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MemberList = ({
  currentUser,
  members,
  onDeleteMember,
  onChangeRole,
  onAddMember,
}: MemberListProps) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const displayMembers = members.filter((member) =>
    member.User.email.includes(searchEmail)
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  displayMembers.sort((a, _b) => (a.User.email === currentUser.email ? -1 : 1));

  const userRole = members.find(
    (member) => member.User.email === currentUser.email
  )!.memberRole;

  const handleAddMember = async () => {
    if (!searchEmail.length) {
      return;
    }

    if (displayMembers.some((member) => member.User.email === searchEmail)) {
      setEmailError("User with this email already added to board.");
      return;
    }

    try {
      z.string().email().parse(searchEmail);
      await onAddMember({ email: searchEmail, memberRole: "COLLABORATOR" });
      setSearchEmail("");
    } catch (err) {
      if (err instanceof ZodError) {
        setEmailError(err.errors[0].message);
      }
    }
  };

  return (
    <div>
      <h2>Members</h2>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMember();
          }}
        >
          <FormField
            style={{ gridTemplateColumns: "1fr auto" }}
            className="grid"
          >
            <FormInput
              placeholder="Email..."
              onChange={(e) => {
                setSearchEmail(e.currentTarget.value);
                setEmailError("");
              }}
              value={searchEmail}
            />
            <div>
              {userRole === "ADMIN" && (
                <Button className="ml-2 px-4">Add</Button>
              )}
            </div>
            <FormInputError>{emailError}</FormInputError>
          </FormField>
        </form>
        {displayMembers.length === 0 && (
          <div className="grid place-items-center bg-gray-200 h-48 rounded font-medium">
            No member found
          </div>
        )}
        {displayMembers.length > 0 &&
          displayMembers.map((member) => (
            <MemberListItem
              key={member.id}
              member={member}
              currentUser={currentUser}
              userRole={userRole}
              onDeleteMember={onDeleteMember}
              onChangeRole={onChangeRole}
            />
          ))}
      </div>
    </div>
  );
};

export default MemberList;
