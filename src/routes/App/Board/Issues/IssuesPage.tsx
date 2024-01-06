import { useState } from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import axiosInstance from "../../../../api/axios";
import { useBoard } from "../../../../hooks/useBoard";
import useProfile from "../../../../hooks/useProfile";
import useRoleContext from "../../../../hooks/useRoleContext";
import { useUpdateCardMutation } from "../../../../hooks/useUpdateCardMutation";
import {
  createCard,
  createColumn,
  moveCardTo,
  removeColumn,
  updateCard,
} from "../../../../slices/BoardSlice";
import { useAppDispatch } from "../../../../store";
import {
  BoardColumnCard,
  BoardColumn as BoardColumnType,
  Comment,
} from "../../../../types/Board";
import NewColumnForm from "../NewColumnForm";
import BoardColumn, { BoardColumnProps } from "./BoardColumn";
import CardDetailModal, { CardDetailModalProps } from "./CardDetailModal";
import Header from "./Header";
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
  const { board } = useBoard();
  const { role } = useRoleContext();
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
  const updateCardMutation = useUpdateCardMutation();

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

  const removeColumnMutation = useMutation({
    mutationFn: async (id: number) => {
      return (await axiosInstance.delete(`/board-column/${id}`)).data;
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

  async function handleRemoveColumn(column: BoardColumnType) {
    await removeColumnMutation.mutateAsync(column.id);
    dispatch(removeColumn(column.id));
  }

  if (!board) {
    return <></>;
  }

  if (!role) {
    return <></>;
  }

  return (
    <div className="flex flex-col self-stretch flex-1 min-w-0">
      <div
        style={{ backgroundImage: `url(${board.background?.url})` }}
        className="fixed -z-50 inset-0 bg-no-repeat bg-cover"
      ></div>
      <Header role={role} board={board} />
      <DragDropContext onDragEnd={onCardDragEnd}>
        <div className="flex-1 overflow-auto p-4 flex gap-4 items-start">
          {board?.BoardColumns.map((column) => (
            <BoardColumn
              onClickCard={handleClickCard}
              onCreateCard={handleCreateCard}
              onRemoveColumn={handleRemoveColumn}
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
