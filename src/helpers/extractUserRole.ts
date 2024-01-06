import { Board } from "../types/Board";

export const extractUserRole = (board: Board, email: string) =>
  board?.BoardMembers.find((m) => m.User.email === email)?.memberRole;
