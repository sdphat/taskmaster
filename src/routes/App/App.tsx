import { AxiosError, HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import FileCopyLine from "remixicon-react/FileCopyLineIcon";
import FlashlightFill from "remixicon-react/FlashlightFillIcon";
import Menu2LineIcon from "remixicon-react/Menu2LineIcon";
import MenuLine from "remixicon-react/MenuLineIcon";
import Settings4Line from "remixicon-react/Settings4LineIcon";
import axiosInstance from "../../api/axios";
import appIconWithText from "../../assets/app-icon-with-text.svg";
import googleIcon from "../../assets/google-icon.svg";
import Button from "../../components/Button";
import ROUTES from "../../constants/routes";
import { BriefProfile } from "../../types/BriefProfile";
import AccountDropdownItem from "./AccountDropdownItem";
import AccountDropdownSection from "./AccountDropdownSection";
import NavLink from "./NavLink";

const App = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const navigate = useNavigate();
  const navBarRef = useRef<HTMLDivElement>(null);
  const [openAccountDropdown, setOpenAccountDropdown] = useState(false);
  const { data: briefProfile } = useQuery<BriefProfile>(
    "profile",
    getBriefProfile,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  async function getBriefProfile() {
    try {
      return (await axiosInstance.get("/auth/profile")).data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === HttpStatusCode.Unauthorized) {
          navigate({ pathname: "/login" }, { replace: true });
        }
      }
    }
  }

  console.log(briefProfile);

  const navBarHeight = navBarRef.current?.clientHeight ?? 0;

  return (
    <div className="h-screen flex flex-col">
      <div
        ref={navBarRef}
        className="flex items-center w-full gap-x-4 px-4 py-4 border-2 border-gray-200"
      >
        <button onClick={() => setOpenSidebar(!openSidebar)}>
          {openSidebar ? <Menu2LineIcon size={30} /> : <MenuLine size={30} />}
        </button>
        <img className="ml-2" src={appIconWithText} alt="" />
        <div className="ml-4 space-x-4">
          <button>Your work</button>
          <button>Projects</button>
          <Button>Create</Button>
        </div>
        <div className="flex-1"></div>
        <div>
          <button
            onClick={() => setOpenAccountDropdown(!openAccountDropdown)}
            className={`rounded-full w-11 h-11 outline-4 p-1 border-[5px] hover:border-gray-100 
            ${openAccountDropdown ? "border-gray-100" : "border-transparent"}`}
          >
            <img src={googleIcon} alt="" className="object-cover" />
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
                    src={googleIcon}
                    alt=""
                    className="w-10 h-10 px-2 flex-none"
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
                <AccountDropdownItem to={ROUTES.LOGOUT}>
                  Log out
                </AccountDropdownItem>
              </AccountDropdownSection>
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-64 border-2 border-t-0 border-gray-200 h-full overflow-hidden ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b-2 border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <FlashlightFill className="flex-none" />{" "}
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              Project name
            </span>
          </div>
        </div>
        <div className="px-4 py-3 space-y-4">
          <NavLink to="/issues">
            <FileCopyLine />
            Issues
          </NavLink>
          <NavLink to="/settings">
            <Settings4Line />
            Project Settings
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default App;
