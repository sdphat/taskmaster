import { useState } from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../api/axios";
import useProfile from "../../../../hooks/useProfile";
import {
  boardSelector,
  createCard,
  moveCardTo,
} from "../../../../slices/BoardSlice";
import { RootState, useAppDispatch } from "../../../../store";
import { BoardColumnCard } from "../../../../types/Board";
import BoardColumn, { BoardColumnProps } from "./BoardColumn";
import CardDetailModal, { CardDetailModalProps } from "./CardDetailModal";
interface MoveCardArgs {
  fromColumn: number;
  fromIdx: number;
  toColumn: number;
  toIdx: number;
}

export interface CreateCardArgs {
  boardColumnId: number;
  summary: string;
}

export interface CreateCardMutationReturn extends BoardColumnCard {
  boardColumnId: number;
}

const IssuesPage = () => {
  const { data: briefProfile } = useProfile();
  const { board } = useSelector<RootState, ReturnType<typeof boardSelector>>(
    boardSelector
  );
  const dispatch = useAppDispatch();

  const moveCardMutation = useMutation({
    mutationFn: async (args: MoveCardArgs) => {
      return (await axiosInstance.post("/board-card/move", args)).data;
    },
  });

  const createCardMutation = useMutation({
    mutationFn: async (
      args: CreateCardArgs
    ): Promise<CreateCardMutationReturn> => {
      return (await axiosInstance.post("/board-card", args)).data;
    },
  });

  const [cardDetail, setCardDetail] = useState<
    CardDetailModalProps | undefined
  >(undefined);

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

  const handleCreateCard: BoardColumnProps["onCreateCard"] = async (args) => {
    const card = await createCardMutation.mutateAsync(args);
    dispatch(createCard(card));
  };

  const handleClickCard: BoardColumnProps["onClickCard"] = async (card) => {
    setCardDetail({
      card,
      columnCard: board!.BoardColumns.find((col) =>
        col.BoardColumnCards.includes(card)
      )!,
      profile: briefProfile,
      onClose: () => setCardDetail(undefined),
    });
  };

  return (
    <div>
      <DragDropContext onDragEnd={onCardDragEnd}>
        <div className="p-4">
          <div className="flex gap-4 items-start">
            {board?.BoardColumns.map((column) => (
              <BoardColumn
                onClickCard={handleClickCard}
                onCreateCard={handleCreateCard}
                key={column.id}
                column={column}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
      {cardDetail && <CardDetailModal {...cardDetail} />}
    </div>
  );
};

export default IssuesPage;
