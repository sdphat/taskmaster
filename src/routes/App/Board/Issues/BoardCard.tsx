import { Draggable } from "react-beautiful-dnd";
import { BoardColumnCard } from "../../../../types/Board";
export interface BoardCardProps {
  boardCard: BoardColumnCard;
  indexInColumn: number;
}

const BoardCard = ({ boardCard, indexInColumn }: BoardCardProps) => {
  return (
    <Draggable draggableId={String(boardCard.id)} index={indexInColumn}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white shadow-sm rounded-xl p-2 border-2 border-gray-200 hover:border-blue-600 transition-colors cursor-pointer"
        >
          {boardCard.Labels.length > 0 && (
            <div className="flex gap-x-1 mb-1">
              {boardCard.Labels.map((label) => (
                <span
                  key={label.id}
                  style={{
                    background: label.color,
                  }}
                  className="w-14 h-2 rounded-full"
                ></span>
              ))}
            </div>
          )}
          <div>{boardCard.summary}</div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardCard;