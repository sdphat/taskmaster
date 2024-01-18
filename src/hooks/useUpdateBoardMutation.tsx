import { useMutation } from "react-query";
import axiosInstance from "../api/axios";

export interface UpdateBoardMutationArgs {
  id: number;
  name?: string;
  backgroundUrl?: string;
}

export const useUpdateBoardMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      name,
      backgroundUrl,
    }: UpdateBoardMutationArgs) => {
      return (await axiosInstance.put(`/board/${id}`, { name, backgroundUrl }))
        .data;
    },
  });
