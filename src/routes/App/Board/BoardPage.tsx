import FileCopyLine from "remixicon-react/FileCopyLineIcon";
import FlashlightFill from "remixicon-react/FlashlightFillIcon";
import Settings4Line from "remixicon-react/Settings4LineIcon";
import ArrowLeftLine from "remixicon-react/ArrowLeftLineIcon";
import ArrowRightLine from "remixicon-react/ArrowRightLineIcon";

import NavLink from "./NavLink";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { Board } from "../../../types/Board";
import { useQuery } from "react-query";

const BoardPage = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const { data } = useQuery<Board>(["issues", 1], async () => {
    return (await axiosInstance.get("/board/1")).data;
  });

  return (
    <div className="flex w-full h-full">
      <div
        className={`relative flex-none w-64 border-2 border-t-0 border-gray-200 h-full transition-transform ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b-2 border-gray-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <FlashlightFill className="flex-none" />{" "}
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              {data?.name}
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
        <button
          className="absolute grid place-items-center 
        bottom-[50%] translate-y-[50%] 
        right-0 translate-x-[50%] 
        rounded-full border-2 border-gray-200 
        bg-white w-6 h-6 shadow-sm
        hover:bg-gray-100"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          {openSidebar ? (
            <ArrowLeftLine className="w-4 h-4" />
          ) : (
            <ArrowRightLine className="w-4 h-4" />
          )}
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default BoardPage;
