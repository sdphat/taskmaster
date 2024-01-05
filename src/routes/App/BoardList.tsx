import tw from "tailwind-styled-components";
import { Board } from "../../types/Board";
import { Link } from "react-router-dom";
import ROUTES from "../../constants/routes";

type BoardSummary = Pick<Board, "name" | "background" | "id">;

interface BoardListProps {
  boards: BoardSummary[] | undefined;
  title: string;
  className?: string;
}

const BoardSectionWrapper = tw.section`
  px-6
  mt-8
`;

const BoardList = ({ boards, title, className }: BoardListProps) => {
  if (!boards || !boards.length) {
    return <></>;
  }

  return (
    <BoardSectionWrapper className={className}>
      <h2 className="mb-2">{title}</h2>
      <div className="grid grid-cols-4 gap-4 auto-rows-fr">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={ROUTES.ISSUES(board.id)}
            style={{ backgroundImage: `url(${board.background?.url})` }}
            className="flex-1 h-40 rounded-md border-2 border-gray-300 overflow-hidden bg-cover hover:shadow-lg transition-all"
          >
            <div className="h-full py-6 px-4 rounded-md bg-gradient-to-r from-slate-100">
              <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {board.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </BoardSectionWrapper>
  );
};

export default BoardList;
