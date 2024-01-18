import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { MoonLoader } from "react-spinners";
import axiosInstance from "../../api/axios";
import AppIcon from "../../assets/app-icon-with-text.svg";
import ROUTES from "../../constants/routes";

const InvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);
  const [isValid, setValid] = useState(false);

  const codeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await axiosInstance.post<{ boardId: number }>(
        "member/board/invitation",
        {
          code,
        }
      );

      setLoading(false);

      if (response.status === HttpStatusCode.BadRequest) {
        setValid(false);
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

  return (
    <div className="grid place-items-center my-12">
      <img src={AppIcon} className="h-16 mb-16" />
      {isLoading && (
        <>
          <MoonLoader color="#1d4ed8" />
          <div className="mt-2 font-medium">
            Please wait. We are currently processing your invitation.
          </div>
        </>
      )}

      {!isValid && (
        <div className="mt-2 font-medium">
          Your invitation code is either incorrect or expired. Please ask your
          board admins to resend the code.
        </div>
      )}
    </div>
  );
};

export default InvitationPage;
