import { useQuery } from "react-query";
import axiosInstance from "../../api/axios";
import { Board } from "../../types/Board";
import BoardList from "./BoardList";

type BoardSummary = Pick<Board, "name" | "background" | "id">;

const App = () => {
  const { data: allBoards } = useQuery({
    queryKey: `all-boards`,
    queryFn: async (): Promise<BoardSummary[]> => {
      return (await axiosInstance.get("/board/all-boards")).data;
    },
  });

  return (
    <div className="py-4">
      {(allBoards && allBoards.length) ? (
        <BoardList boards={allBoards} title="All Boards" />
      ) : (
        <div className="px-4 grid place-items-center bg-gray-300 h-60 font-medium text-lg">
          There isn't any board yet. Create a new board to start your journey.
        </div>
      )}
    </div>
  );
};

export default App;
