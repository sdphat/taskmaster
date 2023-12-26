import { useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import Button from "../../../../components/Button";
import DropdownRemoveAssertion from "../../../../components/DropdownRemoveAssertion";
import ROUTES from "../../../../constants/routes";
import { boardSelector } from "../../../../slices/BoardSlice";
import { RootState } from "../../../../store";
import useProfile from "../../../../hooks/useProfile";

const SettingsPage = () => {
  const { board } = useSelector<RootState, ReturnType<typeof boardSelector>>(
    boardSelector
  );
  const { data: profile } = useProfile();
  const [deleteBtnAnchor, setDeleteBtnAnchor] = useState<HTMLElement>();
  const navigate = useNavigate();
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

  if (!board) {
    return <></>;
  }

  return (
    <div className="py-4 px-8 flex-1">
      <h1>Settings</h1>
      <div className="mt-4">
        <h2>{board.name}</h2>
        <div className="mt-2">
          <h2>Members</h2>
          <div>
            {board.BoardMembers.map((member) => (
              <div>
                <div>{member.User.fullName}</div>
                <div>{member.memberRole}</div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default SettingsPage;
