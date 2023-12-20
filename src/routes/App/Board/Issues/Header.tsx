import More2FillIcon from "remixicon-react/More2FillIcon";
import Button from "../../../../components/Button";
import { Board } from "../../../../types/Board";

export interface HeaderProps {
  board: Board;
}

const Header = ({ board }: HeaderProps) => {
  return (
    <div className="w-full h-12 py-4 px-4 shadow-md bg-opacity-70 flex items-center justify-between">
      <div>
        <h3 className="ml-2">{board.name}</h3>
      </div>
      <div className="flex">
        <div className="flex gap-1">
          {board.BoardMembers.map((member) => (
            <span className="rounded-full overflow-hidden">
              <img src={member.User.avatarUrl} className="w-8 h-8" alt="" />
            </span>
          ))}
        </div>
        <Button className="ml-2" $shape="square" $variant="ghost">
          <More2FillIcon size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
