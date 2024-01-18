import { useMutation } from "react-query";
import axiosInstance from "../Api/axios";
import { Attachment } from "../types/Board";

export interface SendAttachmentMutationArgs {
  file: File;
}

const useSendAttachmentMutation = () =>
  useMutation({
    mutationFn: async ({ file }: SendAttachmentMutationArgs) => {
      return (
        await axiosInstance.post<Attachment>(
          "/attachment",
          {
            file,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      ).data;
    },
  });

export default useSendAttachmentMutation;
