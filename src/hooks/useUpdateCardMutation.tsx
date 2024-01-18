import { useMutation } from "react-query";
import { BoardColumnCard, Label } from "../types/Board";
import axiosInstance from "../api/axios";

export interface UpdateCardArgs {
  cardId: number;
  description?: string;
  summary?: string;
  dueDate?: Date;
  labels?: Pick<Label, "color" | "name">[];
  attachments?: string[];
}

export interface UpdateCardMutationReturn extends BoardColumnCard {
  boardColumnId: number;
}

export const useUpdateCardMutation = () =>
  useMutation({
    mutationFn: async (
      args: UpdateCardArgs
    ): Promise<UpdateCardMutationReturn> => {
      return (await axiosInstance.put("/board-card", args)).data;
    },
  });
