import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  Board,
  BoardColumnCard,
  BoardColumnCardMember,
  Label,
} from "../types/Board";

export interface BoardSliceState {
  board: Board | undefined;
}

export interface MoveCardToPayload {
  fromColumn: number;
  fromIdx: number;
  toColumn: number;
  toIdx: number;
}

export interface CreateCardPayload extends BoardColumnCard {
  boardColumnId: number;
}

export interface UpdateCardPayload extends BoardColumnCard {
  boardColumnId: number;
}

export interface UpdateLabelListPayload {
  cardId: number;
  labelIds: number[];
}

interface AddCardMemberPayload {
  cardMember: BoardColumnCardMember;
  cardId: number;
}

interface RemoveCardMemberPayload {
  cardId: number;
  memberId: number;
}

function sortBoardInPlace(board: Board) {
  board.BoardColumns.forEach((column) =>
    column.BoardColumnCards.sort((a, b) => a.cardIdx - b.cardIdx)
  );
  return board;
}

const boardSlice = createSlice({
  name: "board",
  initialState: {
    board: undefined,
  } as BoardSliceState,
  reducers: {
    moveCardTo(state, action: PayloadAction<MoveCardToPayload>) {
      const {
        fromColumn: fromColumnId,
        toIdx: moveToIdx,
        toColumn: toColumnId,
        fromIdx,
      } = action.payload;

      const toColumn = state.board!.BoardColumns.find(
        (col) => col.id === toColumnId
      )!;

      const fromColumn = state.board!.BoardColumns.find(
        (col) => col.id === fromColumnId
      )!;

      // Make space for the card in destination column
      toColumn.BoardColumnCards.forEach((card) => {
        if (card.cardIdx >= moveToIdx) {
          card.cardIdx += 1;
        }
      });

      // Move the card to destination
      const card = fromColumn.BoardColumnCards.splice(fromIdx, 1)[0];
      toColumn.BoardColumnCards.splice(moveToIdx, 0, card);
      card.cardIdx = moveToIdx;

      // Fill the gap in source column
      fromColumn.BoardColumnCards.forEach((card) => {
        if (card.cardIdx > fromIdx) {
          card.cardIdx -= 1;
        }
      });
    },

    createCard(
      state,
      { payload: { boardColumnId, ...card } }: PayloadAction<CreateCardPayload>
    ) {
      state
        .board!.BoardColumns.find((b) => b.id === boardColumnId)!
        .BoardColumnCards.push(card);
    },

    updateCard(
      state,
      { payload: { boardColumnId, ...card } }: PayloadAction<UpdateCardPayload>
    ) {
      state
        .board!.BoardColumns.find((b) => b.id === boardColumnId)!
        .BoardColumnCards.splice(card.cardIdx, 1, card);
    },

    setBoard(state, action: PayloadAction<Board>) {
      state.board = action.payload;
      sortBoardInPlace(state.board);
    },

    createLabel(state, action: PayloadAction<Label>) {
      state.board!.BoardLabels.push(action.payload);
    },

    updateLabel(state, { payload }: PayloadAction<Label>) {
      // Update board label
      const label = state.board!.BoardLabels.find(
        (label) => label.id === payload.id
      );
      if (!label) {
        return;
      }
      label.name = payload.name;
      label.color = payload.color;

      // Update each card with matched label
      const labelsWithPayloadId = state
        .board!.BoardColumns.flatMap(({ BoardColumnCards }) => BoardColumnCards)
        .flatMap((card) => card.Labels)
        .filter((label) => label.id === payload.id);

      labelsWithPayloadId.forEach((label) => {
        label.color = payload.color;
        label.name = payload.name;
      });
    },

    removeLabel(state, { payload }: PayloadAction<Label>) {
      console.log(state.board?.BoardColumns);
      // Remove label in board
      state.board!.BoardLabels = state.board!.BoardLabels.filter(
        (label) => label.id !== payload.id
      );

      // Remove label in each card
      state.board!.BoardColumns = state.board!.BoardColumns.map((col) => ({
        ...col,
        BoardColumnCards: [
          ...col.BoardColumnCards.map((card) => ({
            ...card,
            Labels: card.Labels.filter((label) => label.id !== payload.id),
          })),
        ],
      }));

      return state;
    },

    updateLabelList(state, { payload }: PayloadAction<UpdateLabelListPayload>) {
      const card = state
        .board!.BoardColumns.flatMap((col) => col.BoardColumnCards)
        .find((card) => card.id === payload.cardId);
      if (!card) {
        return;
      }

      const allLabels = state.board!.BoardLabels;
      card.Labels = allLabels.filter((label) =>
        payload.labelIds.includes(label.id)
      );
    },

    removeCardMember(
      state,
      { payload }: PayloadAction<RemoveCardMemberPayload>
    ) {
      const card = state
        .board!.BoardColumns.flatMap((col) => col.BoardColumnCards)
        .find((card) => card.id === payload.cardId);

      if (!card) {
        return;
      }

      card.BoardColumnCardMembers = card.BoardColumnCardMembers.filter(
        (m) => m.Member.id !== payload.memberId
      );
    },

    addCardMember(state, { payload }: PayloadAction<AddCardMemberPayload>) {
      const card = state
        .board!.BoardColumns.flatMap((col) => col.BoardColumnCards)
        .find((card) => card.id === payload.cardId);

      if (!card) {
        return;
      }

      card.BoardColumnCardMembers.push(payload.cardMember);
    },

    removeCard(state, { payload: cardId }: PayloadAction<number>) {
      state.board!.BoardColumns.forEach((col) => {
        col.BoardColumnCards = col.BoardColumnCards.filter(
          (card) => card.id !== cardId
        );
      });
    },
  },
});

export const boardReducer = boardSlice.reducer;
export const {
  updateLabel,
  updateLabelList,
  createCard,
  removeCard,
  moveCardTo,
  setBoard,
  updateCard,
  createLabel,
  removeLabel,
  addCardMember,
  removeCardMember,
} = boardSlice.actions;
export const boardSelector = (state: RootState) => state.board;
