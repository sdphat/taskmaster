import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Board, BoardColumnCard } from "../types/Board";

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
  },
});

export const boardReducer = boardSlice.reducer;
export const { createCard, moveCardTo, setBoard, updateCard } = boardSlice.actions;
export const boardSelector = (state: RootState) => state.board;
