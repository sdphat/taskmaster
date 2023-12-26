import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import Button from "../../../../components/Button";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";
import ROUTES from "../../../../constants/routes";
import useProfile from "../../../../hooks/useProfile";
import {
  boardSelector,
  removeBoardMember,
} from "../../../../slices/BoardSlice";
import { RootState, useAppDispatch } from "../../../../store";
import MemberList from "./MemberList";
import { useState } from "react";
import { BoardMember } from "../../../../types/Board";

interface RemoveMemberMutationArgs {
  boardId: number;
  memberUserId: number;
}

const SettingsPage = () => {
  const [deleteBtnAnchor, setDeleteBtnAnchor] = useState<HTMLElement>();
  const { board } = useSelector<RootState, ReturnType<typeof boardSelector>>(
    boardSelector
  );
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const removeMemberMutation = useMutation({
    async mutationFn(args: RemoveMemberMutationArgs) {
      return (
        await axiosInstance.delete(`member/board`, {
          data: args,
        })
      ).data;
    },
  });

  const userRole = board?.BoardMembers.find(
    (m) => m.User.email === profile.email
  )?.memberRole;

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

  if (!board) {
    return <></>;
  }

  return (
    <div className="py-4 px-8 flex-1">
      <h1>{board.name}'s Settings</h1>
      <div className="mt-8">
        <MemberList
          members={board.BoardMembers}
          currentUser={profile}
          onDeleteMember={handleRemoveMember}
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
