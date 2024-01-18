import { useMutation } from "react-query";
import axiosInstance from "../Api/axios";

export interface UseRemoveAttachmentMutationArgs {
  url: string;
}

const useRemoveAttachmentMutation = () =>
  useMutation({
    mutationFn: async ({ url }: UseRemoveAttachmentMutationArgs) => {
      await axiosInstance.delete("/attachment", {
        data: {
          url,
        },
      });
    },
  });

export default useRemoveAttachmentMutation;
