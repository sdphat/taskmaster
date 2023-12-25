import { useQuery } from "react-query";
import axiosInstance from "../../api/axios";
import { Board } from "../../types/Board";
import BoardList from "./BoardList";

type BoardSummary = Pick<Board, "name" | "backgroundUrl" | "id">;

const App = () => {
  const { data: allBoards } = useQuery({
    queryKey: `all-boards`,
    queryFn: async (): Promise<BoardSummary[]> => {
      return (await axiosInstance.get("/board/all-boards")).data;
    },
  });

  return (
    <div className="py-4">
      <BoardList boards={undefined} title="Recent Boards" className="mt-0" />
      <BoardList boards={allBoards} title="All Boards" />
    </div>
  );
};

export default App;
