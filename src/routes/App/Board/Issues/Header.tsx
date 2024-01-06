import { useState } from "react";
import More2FillIcon from "remixicon-react/More2FillIcon";
import Button from "../../../../components/Button";
import { Board, BoardRole } from "../../../../types/Board";
import BoardOptionDropdown from "./BoardOptionDropdown";

export interface HeaderProps {
  board: Board;
  role: BoardRole;
}

const Header = ({ board, role }: HeaderProps) => {
  const [optionBtn, setOptionBtn] = useState<HTMLElement>();

  return (
    <div className="w-full h-12 py-4 px-4 shadow-md bg-white bg-opacity-90 flex items-center justify-between">
      <div>
        <h3 className="ml-2">{board.name}</h3>
      </div>
      <div className="flex">
        <div className="flex gap-1">
          {board.BoardMembers.map((member) => (
            <img
              key={member.id}
              src={member.User.avatarUrl}
              className="w-8 h-8 rounded-full object-cover object-center"
              alt=""
            />
          ))}
        </div>
        <Button
          onClick={(e) => setOptionBtn(e.currentTarget)}
          className="ml-2"
          $shape="square"
          $variant="ghost"
        >
          <More2FillIcon size={18} />
        </Button>
        {optionBtn && (
          <BoardOptionDropdown
            role={role}
            anchor={optionBtn}
            onCloseDropdown={() => setOptionBtn(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
