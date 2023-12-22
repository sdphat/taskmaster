import { useState } from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../api/axios";
import useProfile from "../../../../hooks/useProfile";
import {
  boardSelector,
  createCard,
  createColumn,
  moveCardTo,
  updateCard,
} from "../../../../slices/BoardSlice";
import { RootState, useAppDispatch } from "../../../../store";
import {
  BoardColumn as BoardColumnType,
  BoardColumnCard,
  Comment,
  Label,
} from "../../../../types/Board";
import BoardColumn, { BoardColumnProps } from "./BoardColumn";
import CardDetailModal, { CardDetailModalProps } from "./CardDetailModal";
import Header from "./Header";
import NewColumnForm from "../NewColumnForm";
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

export interface UpdateCardArgs {
  cardId: number;
  description?: string;
  summary?: string;
  dueDate?: Date;
  labels?: Pick<Label, "color" | "name">[];
}

export interface UpdateCardMutationReturn extends BoardColumnCard {
  boardColumnId: number;
}

export interface CreateCommentMutationReturn extends Comment {}

export interface CreateCommentArgs {
  cardId: number;
  createdDate: Date;
  content: string;
}

export interface CreateColumnArgs {
  boardId: number;
  columnName: string;
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

  const updateCardMutation = useMutation({
    mutationFn: async (
      args: UpdateCardArgs
    ): Promise<UpdateCardMutationReturn> => {
      return (await axiosInstance.put("/board-card", args)).data;
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (
      args: CreateCommentArgs
    ): Promise<CreateCommentMutationReturn> => {
      return (await axiosInstance.post("/comment", args)).data;
    },
  });

  const createColumnMutation = useMutation({
    mutationFn: async ({
      boardId,
      columnName,
    }: CreateColumnArgs): Promise<BoardColumnType> => {
      return (
        await axiosInstance.post("/board-column", { columnName, boardId })
      ).data;
    },
  });

  const [cardDetailPosition, setCardDetailPosition] = useState<{
    cardIdx: number;
    colId: number;
  }>();

  const selectedColumn: BoardColumnType | undefined = board?.BoardColumns.find(
    (col) => col.id === cardDetailPosition?.colId
  );

  const cardDetail:
    | Pick<CardDetailModalProps, "card" | "columnCard" | "profile">
    | undefined = selectedColumn
    ? {
        columnCard: selectedColumn,
        card:
          selectedColumn.BoardColumnCards[cardDetailPosition?.cardIdx ?? -1] ??
          undefined,
        profile: briefProfile,
      }
    : undefined;

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
    board!.BoardColumns.forEach((col) => {
      col.BoardColumnCards.forEach((c, cardIdx) => {
        if (c.id === card.id) {
          setCardDetailPosition({ cardIdx, colId: col.id });
          return;
        }
      });
    });
  };

  function handleCloseCardDetailModal() {
    setCardDetailPosition(undefined);
  }

  async function handleSaveComment(comment: string) {
    const returnComment = await createCommentMutation.mutateAsync({
      cardId: cardDetail!.card.id,
      content: comment,
      createdDate: new Date(),
    });

    dispatch(
      updateCard({
        ...cardDetail!.card,
        Comments: [...cardDetail!.card.Comments]
          .concat(returnComment)
          .sort((a, b) => b.id - a.id),
        boardColumnId: cardDetail!.columnCard.id,
      })
    );
  }

  async function handleSaveDescription(description: string): Promise<void> {
    const card = await updateCardMutation.mutateAsync({
      cardId: cardDetail!.card.id,
      description,
    });

    dispatch(updateCard(card));
  }

  async function handleSaveTitle(title: string): Promise<void> {
    const card = await updateCardMutation.mutateAsync({
      cardId: cardDetail!.card.id,
      summary: title,
    });

    dispatch(updateCard(card));
  }

  async function handleAddColumn(columnName: string): Promise<void> {
    const newColumn = await createColumnMutation.mutateAsync({
      columnName,
      boardId: board!.id,
    });
    dispatch(createColumn(newColumn));
  }

  if (!board) {
    return <></>;
  }

  return (
    <div className="flex flex-col self-stretch flex-1 min-w-0">
      <Header board={board} />
      <DragDropContext onDragEnd={onCardDragEnd}>
        <div className="flex-1 overflow-auto p-4 flex gap-4 items-start">
          {board?.BoardColumns.map((column) => (
            <BoardColumn
              onClickCard={handleClickCard}
              onCreateCard={handleCreateCard}
              key={column.id}
              column={column}
            />
          ))}
          <NewColumnForm onAddColumn={handleAddColumn} />
        </div>
      </DragDropContext>
      {cardDetail && (
        <CardDetailModal
          {...cardDetail}
          board={board!}
          onClose={handleCloseCardDetailModal}
          onSaveComment={handleSaveComment}
          onSaveDescription={handleSaveDescription}
          onSaveTitle={handleSaveTitle}
        />
      )}
    </div>
  );
};

export default IssuesPage;
