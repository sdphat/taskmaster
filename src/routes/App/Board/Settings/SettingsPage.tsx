import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import EditBoxLineIcon from "remixicon-react/EditBoxLineIcon";
import axiosInstance from "../../../../api/axios";
import Button from "../../../../components/Button";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";
import FormInput from "../../../../components/FormInput";
import ROUTES from "../../../../constants/routes";
import { useBoard } from "../../../../hooks/useBoard";
import useProfile from "../../../../hooks/useProfile";
import { useUpdateBoardMutation } from "../../../../hooks/useUpdateBoardMutation";
import {
  addBoardMember,
  changeBoardMemberRole,
  removeBoardMember,
  updateBoard,
} from "../../../../slices/BoardSlice";
import { useAppDispatch } from "../../../../store";
import { BoardMember, BoardRole } from "../../../../types/Board";
import MemberList from "./MemberList";

interface RemoveMemberMutationArgs {
  boardId: number;
  memberUserId: number;
}

interface ChangeMemberRoleMutationArgs {
  role: BoardRole;
  memberId: number;
}

interface AddMemberMutationArgs {
  boardId: number;
  memberRole: BoardRole;
  email: string;
}

interface HandleAddMemberData {
  memberRole: BoardRole;
  email: string;
}

const SettingsPage = () => {
  const [deleteBtnAnchor, setDeleteBtnAnchor] = useState<HTMLElement>();
  const [isEditingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const { board } = useBoard();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const updateBoardMutation = useUpdateBoardMutation();

  const removeMemberMutation = useMutation({
    async mutationFn(args: RemoveMemberMutationArgs) {
      return (await axiosInstance.delete(`member/board`, { data: args })).data;
    },
  });

  const changeMemberRoleMutation = useMutation({
    async mutationFn(args: ChangeMemberRoleMutationArgs) {
      return await axiosInstance.put(`member/board/role`, args);
    },
  });

  const addMemberMutation = useMutation({
    async mutationFn(args: AddMemberMutationArgs): Promise<BoardMember> {
      return (await axiosInstance.post(`member/board`, args)).data;
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (boardId: number) => {
      return (await axiosInstance.delete(`board/${boardId}`)).data;
    },
  });

  const handleDeleteBoard = async () => {
    await deleteBoardMutation.mutateAsync(board!.id);
    navigate(ROUTES.APP);
  };

  const handleRemoveMember = async (member: BoardMember) => {
    await removeMemberMutation.mutateAsync({
      memberUserId: member.User.id,
      boardId: board!.id,
    });
    dispatch(removeBoardMember(member.id));
  };

  const handleChangeMemberRole = async (member: BoardMember) => {
    await changeMemberRoleMutation.mutateAsync({
      memberId: member.id,
      role: member.memberRole,
    });

    dispatch(
      changeBoardMemberRole({
        boardMemberId: member.id,
        memberRole: member.memberRole,
      })
    );
  };

  async function handleAddMember({ email, memberRole }: HandleAddMemberData) {
    const newMember = await addMemberMutation.mutateAsync({
      boardId: board!.id,
      email,
      memberRole,
    });
    dispatch(addBoardMember(newMember));
  }

  async function handleChangeBoardName() {
    const name = editedName;
    await updateBoardMutation.mutateAsync({ id: board!.id, name });
    dispatch(updateBoard({ ...board!, name }));
    setEditingName(false);
  }

  if (!board) {
    return <></>;
  }

  const userRole = board?.BoardMembers.find(
    (m) => m.User.email === profile.email
  )?.memberRole;

  return (
    <div className="py-4 px-8 flex-1">
      <h1>Board Settings</h1>
      <div className="mt-2">
        {isEditingName ? (
          <>
            <FormInput
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <div className="mt-2">
              <Button
                onClick={() => setEditingName(false)}
                $variant="neutral"
                className="mr-4"
              >
                Cancel
              </Button>
              <Button onClick={handleChangeBoardName}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <h2>
              {board.name}{" "}
              <EditBoxLineIcon
                onClick={() => {
                  setEditingName(true);
                  setEditedName(board.name);
                }}
                className="inline mb-2 cursor-pointer"
                size={18}
              />
            </h2>
          </>
        )}
      </div>
      <div className="mt-8">
        <MemberList
          members={board.BoardMembers}
          currentUser={profile}
          onDeleteMember={handleRemoveMember}
          onChangeRole={handleChangeMemberRole}
          onAddMember={handleAddMember}
        />
        <div className="h-[1px] bg-gray-300 my-1"></div>
        {userRole === "ADMIN" && (
          <Button
            onClick={(e) => setDeleteBtnAnchor(e.currentTarget)}
            $variant="danger"
            className="mt-2"
          >
            Delete this board
          </Button>
        )}

        {deleteBtnAnchor && (
          <DropdownRemoveAssertion
            anchor={deleteBtnAnchor}
            onClickDeleteConfirm={handleDeleteBoard}
            onCloseDropdown={() => setDeleteBtnAnchor(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
