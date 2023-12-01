import { useQuery } from "react-query";
import axiosInstance from "../../../../api/axios";
import { Board } from "../../../../types/Board";
import Button from "../../../../components/Button";
import More2FillIcon from "remixicon-react/More2FillIcon";
import AddLineIcon from "remixicon-react/AddLineIcon";
import BoardCard from "./BoardCard";

const IssuesPage = () => {
  const { data } = useQuery<Board>(["issues", 1], async () => {
    return (await axiosInstance.get("/board/1")).data;
  });

  return (
    <div className="p-4">
      <div className="flex gap-4 items-start">
        {data?.BoardColumns.map((column) => (
          <div className="rounded-lg bg-gray-100 w-80 p-3">
            <div className="flex items-center">
              <div className="px-2 text-sm text-[#44546f] font-semibold">
                {column.name}
              </div>
              <div className="flex-1"></div>
              <Button $variant="ghost" $shape="square" className="self-start">
                <More2FillIcon size={16} />
              </Button>
            </div>

            <div key={column.id} className="space-y-2 mt-2">
              {column?.BoardColumnCards.map((boardCard) => (
                <BoardCard boardCard={boardCard} />
              ))}
            </div>

            <div className="mt-2">
              <Button
                $variant="ghost"
                $shape="rect"
                className="w-full flex items-center text-sm"
              >
                <AddLineIcon className="mr-2" size={20}></AddLineIcon>{" "}
                <span className="text-[#44546f] font-semibold">Add a card</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesPage;
