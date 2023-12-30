import { useMutation } from "react-query";
import {
  createSearchParams,
  useHref,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useEffect } from "react";
import { HttpStatusCode } from "axios";
import ROUTES from "../../constants/routes";

const InvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const codeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await axiosInstance.post<{ boardId: number }>(
        "member/board/invitation",
        {
          code,
        }
      );
      if (response.status === HttpStatusCode.BadRequest) {
        console.log("Code is invalid");
        return;
      }
      if (response.status === HttpStatusCode.NotFound) {
        navigate({
          pathname: ROUTES.REGISTER,
          search: createSearchParams({
            redirect: location.pathname + location.search,
          }).toString(),
        });
        return;
      }

      navigate(ROUTES.ISSUES(response.data.boardId));
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
