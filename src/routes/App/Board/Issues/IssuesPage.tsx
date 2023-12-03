import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../api/axios";
import { boardSelector, moveCardTo } from "../../../../slices/BoardSlice";
import { RootState, useAppDispatch } from "../../../../store";
import BoardColumn from "./BoardColumn";

interface MoveCardArgs {
  fromColumn: number;
  fromIdx: number;
  toColumn: number;
  toIdx: number;
}

const IssuesPage = () => {
  const { board } = useSelector<RootState, ReturnType<typeof boardSelector>>(
    boardSelector
  );

  const moveCardMutation = useMutation({
    mutationFn: async (args: MoveCardArgs) => {
      return (await axiosInstance.post("/board-card/move", args)).data;
    },
  });

  const dispatch = useAppDispatch();

  const onCardDragEnd: OnDragEndResponder = ({ source, destination }) => {
    const args: MoveCardArgs = {
      fromColumn: +source.droppableId,
      fromIdx: source.index,
      toColumn: +(destination?.droppableId ?? source.droppableId),
      toIdx: +(destination?.index ?? source.index),
    };

    dispatch(moveCardTo(args));
    moveCardMutation.mutateAsync(args);
  };

  return (
    <DragDropContext onDragEnd={onCardDragEnd}>
      <div className="p-4">
        <div className="flex gap-4 items-start">
          {board?.BoardColumns.map((column) => (
            <BoardColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default IssuesPage;
