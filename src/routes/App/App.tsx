import Menu2LineIcon from "remixicon-react/Menu2LineIcon";
import FileCopyLine from "remixicon-react/FileCopyLineIcon";
import Settings4Line from "remixicon-react/Settings4LineIcon";
import FlashlightFill from "remixicon-react/FlashlightFillIcon";
import MenuLine from "remixicon-react/MenuLineIcon";
import appIconWithText from "../../assets/app-icon-with-text.svg";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import axiosInstance from "../../Api/axios";
import { AxiosError, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkIsLogin() {
      try {
        await axiosInstance.get("/auth/profile");
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === HttpStatusCode.Unauthorized) {
            navigate({ pathname: "/login" }, { replace: true });
          }
        }
      }
    }

    checkIsLogin();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center w-full gap-x-4 px-4 py-4 border-2 border-gray-200">
        <button onClick={() => setOpenSidebar(!openSidebar)}>
          {openSidebar ? <Menu2LineIcon size={30} /> : <MenuLine size={30} />}
        </button>
        <img className="ml-2" src={appIconWithText} alt="" />
        <div className="flex-1"></div>
        <button>Your work</button>
        <button>Projects</button>
        <Button>Create</Button>

        
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
