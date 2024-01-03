import { AxiosError, HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import appIconWithText from "../../assets/app-icon-with-text.svg";
import Button from "../../components/Button";
import ROUTES from "../../constants/routes";
import useProfile from "../../hooks/useProfile";
import { Board } from "../../types/Board";
import AccountDropdownItem from "./Board/AccountDropdownItem";
import AccountDropdownSection from "./Board/AccountDropdownSection";
import CreateBoardDropdown, { CreateBoardData } from "./CreateBoardDropdown";

interface CreateBoardMutationArgs {
  title: string;
}

const AppLayout = () => {
  const queryClient = useQueryClient();
  const navBarRef = useRef<HTMLDivElement>(null);
  const [openAccountDropdown, setOpenAccountDropdown] = useState(false);
  const [createBoardAnchor, setCreateBoardAnchor] = useState<HTMLElement>();
  const { data: briefProfile, error: profileError } = useProfile();
  const navigate = useNavigate();

  if (
    profileError instanceof AxiosError &&
    profileError.response?.status === HttpStatusCode.Unauthorized
  ) {
    navigate({ pathname: ROUTES.LOGIN }, { replace: true });
  }

  const navBarHeight = navBarRef.current?.clientHeight ?? 0;

  const createBoardMutation = useMutation({
    mutationFn: async (args: CreateBoardMutationArgs): Promise<Board> => {
      return (await axiosInstance.post("board", args)).data;
    },
  });

  async function handleLogout() {
    await axiosInstance.post("auth/logout");
    queryClient.clear();
    navigate(ROUTES.LOGIN);
  }

  async function handleCreateBoard(args: CreateBoardData) {
    await createBoardMutation.mutateAsync(args);
    await queryClient.invalidateQueries(`all-boards`);
    setCreateBoardAnchor(undefined);
  }

  return (
    <div className="h-screen flex flex-col">
      <div
        ref={navBarRef}
        className="flex items-center w-full gap-x-4 px-4 py-4 border-2 border-gray-200"
      >
        <img className="ml-2" src={appIconWithText} alt="" />
        <div className="ml-4 space-x-4">
          <button>Your work</button>
          <button>Projects</button>
          <Button onClick={(e) => setCreateBoardAnchor(e.currentTarget)}>
            Create
          </Button>
          {createBoardAnchor && (
            <CreateBoardDropdown
              anchor={createBoardAnchor}
              onCloseDropdown={() => setCreateBoardAnchor(undefined)}
              onCreateBoard={handleCreateBoard}
            />
          )}
        </div>
        <div className="flex-1"></div>
        <div>
          <button
            onClick={() => setOpenAccountDropdown(!openAccountDropdown)}
            className={`rounded-full w-11 h-11 outline-4 p-1 border-[5px] hover:border-gray-100 
            ${openAccountDropdown ? "border-gray-100" : "border-transparent"}`}
          >
            <img
              src={briefProfile?.avatarUrl}
              alt=""
              className="rounded-full w-full h-full object-cover object-center"
            />
          </button>
          {openAccountDropdown && (
            <div
              style={{ top: navBarHeight }}
              className="absolute right-4 w-80 
            rounded-md border-2 bg-white border-gray-300 
            shadow-md py-2"
            >
              <AccountDropdownSection>
                <div className="flex">
                  <img
                    src={briefProfile?.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover object-center ml-2 flex-none"
                  />
                  <div className="ml-2">
                    <div className="text-sm">{briefProfile?.fullName}</div>
                    <div className="text-xs">{briefProfile?.email}</div>
                  </div>
                </div>
              </AccountDropdownSection>
              <AccountDropdownSection>
                <AccountDropdownItem to={ROUTES.MY_ACCOUNT}>
                  Manage account
                </AccountDropdownItem>
              </AccountDropdownSection>
              <AccountDropdownSection includeDivider={false}>
                <AccountDropdownItem
                  to={{ pathname: window.location.pathname }}
                  onClick={handleLogout}
                >
                  Log out
                </AccountDropdownItem>
              </AccountDropdownSection>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AppLayout;
