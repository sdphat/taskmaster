import { useMutation } from "react-query";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useEffect } from "react";

const InvitationPage = () => {
  const [searchParams] = useSearchParams();

  const codeMutation = useMutation({
    mutationFn: async (code: string) => {
      return (await axiosInstance.post("member/board/invitation", { code }))
        .data;
    },
  });

  useEffect(() => {
    async function postCode() {
      if (!searchParams.get("code")) {
        return;
      }
      await codeMutation.mutateAsync(searchParams.get("code") as string);
    }

    postCode();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>InvitationPage</div>;
};

export default InvitationPage;
