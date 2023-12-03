import { Droppable } from "react-beautiful-dnd";
import AddLineIcon from "remixicon-react/AddLineIcon";
import More2FillIcon from "remixicon-react/More2FillIcon";
import Button from "../../../../components/Button";
import BoardCard from "./BoardCard";
import { BoardColumn as BoardColumnType } from "../../../../types/Board";

export interface BoardColumnProps {
  column: BoardColumnType;
}

const BoardColumn = ({ column }: BoardColumnProps) => {
  return (
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

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 mt-2"
          >
            {column?.BoardColumnCards.map((boardCard, i) => (
              <BoardCard
                key={boardCard.id}
                indexInColumn={i}
                boardCard={boardCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
  );
};

export default BoardColumn;
