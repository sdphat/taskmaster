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
import Select from "react-select";
import { BoardRole } from "../../../../types/Board";

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
      <h1>{board.name}'s Settings</h1>
      <div className="mt-8">
        <div>
          <h2>Members</h2>
          <div>
            {board.BoardMembers.map((member) => (
              <div className="hover:bg-gray-200 px-2 transition-all rounded">
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
                      member.User.email !== profile.email && (
                        <Button $variant="danger">Remove member</Button>
                      )}
                  </div>
                </div>
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
