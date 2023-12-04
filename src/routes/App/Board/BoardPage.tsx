import ArrowLeftLine from "remixicon-react/ArrowLeftLineIcon";
import ArrowRightLine from "remixicon-react/ArrowRightLineIcon";
import FileCopyLine from "remixicon-react/FileCopyLineIcon";
import FlashlightFill from "remixicon-react/FlashlightFillIcon";
import Settings4Line from "remixicon-react/Settings4LineIcon";

import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { boardSelector, setBoard } from "../../../slices/BoardSlice";
import { RootState, useAppDispatch } from "../../../store";
import { Board } from "../../../types/Board";
import NavLink from "./NavLink";

const BoardPage = () => {
  const { id } = useParams();
  const { board } = useSelector<RootState, ReturnType<typeof boardSelector>>(
    boardSelector
  );
  const dispatch = useAppDispatch();
  const { data } = useQuery<Board>(
    ["issues", id],
    async () => {
      const data = (await axiosInstance.get("/board/" + id)).data;
      dispatch(setBoard(data));
      return data;
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );

  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <div className="flex w-full h-full">
      <div
        className={`relative flex-none w-64 border-2 border-t-0 border-gray-200 h-full transition-transform transition-[width] ${
          openSidebar
            ? "translate-x-0"
            : "-translate-x-[100%] border-r-0 w-0 overflow-hidden"
        }`}
      >
        <div className="border-b-2 border-gray-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <FlashlightFill className="flex-none" />{" "}
            <span className="break-all">{data?.name}</span>
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
      {/* Ledge to open drawer */}
      <div
        className={`relative group h-full w-4 top-0 -left-[1px] transition-all
            ${
              openSidebar
                ? "bg-transparent border-0"
                : "bg-white border-r-2 border-gray-200 hover:bg-gray-300 hover:border-gray-400 cursor-pointer"
            }
          `}
        onClick={() => !openSidebar && setOpenSidebar(true)}
      >
        {/* Open/Close drawer button */}
        <button
          className={`absolute grid place-items-center
              bottom-[50%] translate-y-[50%]
              rounded-full border-2 border-gray-200 bg-white 
              w-6 h-6 shadow-sm
              ${
                openSidebar
                  ? "hover:bg-gray-100 left-0 -translate-x-[50%]"
                  : "group-hover:bg-gray-100 right-0 translate-x-[50%]"
              }`}
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          {openSidebar ? (
            <ArrowLeftLine className="w-4 h-4" />
          ) : (
            <ArrowRightLine className="w-4 h-4" />
          )}
        </button>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default BoardPage;
